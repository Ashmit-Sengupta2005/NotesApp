import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();
const redis= Redis.fromEnv();

export const ratelimit=new Ratelimit({
    redis:redis,
    limiter:Ratelimit.slidingWindow(100,"1 m"),
    prefix:'ratelimit'
});