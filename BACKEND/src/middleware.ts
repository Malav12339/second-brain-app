import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";

interface JwtPayload {
    id: string
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    if(!header) {
        res.status(401).json({msg: "token is required"})
        return;  
    }

    try {
        const decoded = jwt.verify(header, JWT_PASSWORD) as JwtPayload
        
        req.userId = decoded.id
        next()
    } catch(e) {
        console.error("error came while verifing token ", e)
        res.status(401).json({msg: "You are not logged in"})
        return;
    }
}