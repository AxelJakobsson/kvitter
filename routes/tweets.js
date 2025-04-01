import express from "express"
import pool from "../db.js"
import { body, matchedData, validationResult } from "express-validator"
import bcrypt, { hash } from "bcrypt";

const router = express.Router()





export default router