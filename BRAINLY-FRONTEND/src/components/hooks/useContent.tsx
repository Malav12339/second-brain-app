import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";

export function useContent() {
    const [content, setContent] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<AxiosError | null>(null)
    const [intervalId, setIntervalId] = useState<number | null>(null)

    // helper function to identify error type
    type ErrorType = 'client' | 'auth' | 'network' | 'server'
    function getErrorType(err: AxiosError | null): ErrorType | null  {
        if(!err) return null 
        if(!err.response) return 'network'
        if([401, 403, 411].includes(err.response.status)) return 'auth'
        if(err.response.status >= 500) return 'server'
        return 'client'
    }

    function refresh() {
        const token = localStorage.getItem("token")
        if(!token) {
            setError({ response: { status: 411}} as AxiosError)
            setContent([])
            stopPolling()
            return;
        }
        setLoading(true)
        setError(null)
        axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                "Authorization": token
            }
        })
            .then((response) => {
                setContent(response.data.content)

                // Resume polling on successfull request
                startPolling()
            })
            .catch((error) => {
                setError(error)
                setContent([])

                // stop polling on auth errors
                if([401, 403].includes(error.response?.status || 0)) {
                    stopPolling()
                    return;
                }
            }) 
            .finally(() => setLoading(false))
    }

    function startPolling() {
        if(intervalId || getErrorType(error) === 'auth') return;
        const newIntervalId = setInterval(refresh, 10 * 1000)
        setIntervalId(newIntervalId)
    }

    function stopPolling() {
        if(intervalId) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
    }

    useEffect(() => {
        refresh()
        return () => stopPolling()
    }, [])

    return {
        content, 
        loading,
        errorType: getErrorType(error),
        refresh
    }
}