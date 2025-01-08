'use server'

import {axiosPrivate} from "../services/axios.js"
import { AxiosError } from "axios";
import { cookies } from 'next/headers';

import { z } from "zod";

type RegisterResponse = {
    message: string;
    errors?: Record<string, string[] | undefined>,
};

export const createUser = async (
  state: { message: string | null, errors?: Record<string, string[] | undefined> },
  formData: FormData
): Promise<RegisterResponse> => {

    const UserValidation = z.object({
        firstName: z.string().nonempty("First Name is required."),
        lastName: z.string().nonempty("Last Name is required."),
        email: z.string().email("Invalid email address."),
        password: z.string().min(8, "Password must be at least 8 characters long."),
        confirmPassword: z.string().nonempty("Confirm Password is required."),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], 
    });


    try {
        const formValues = Object.fromEntries(formData.entries());
        UserValidation.parse(formValues);
        
        const inputValues = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string
        }

        const {data} = await axiosPrivate.post("/register", { ...inputValues });
        
        if (!data) {
        return { message: "", errors: data.errors || { root: ["Something went wrong. Please try again!"] } };
        }
        
        return data;

    } catch (error) {

        if (error instanceof z.ZodError) {
            
            return {
                message: '',
                errors: error.flatten().fieldErrors,
            };
        }

        if (error instanceof AxiosError && error.response) {
            const { message } = error.response.data;

            if (message.includes("Passwords do not match")) {
                return {
                    message: "",
                    errors: { confirmPassword: ["Passwords do not match."] },
                };
            }

            if (message.includes("user registration with this")) {
                return {
                    message: "",
                    errors: { email: ["Email is already registered."] },
                };
            }

            return {
                message: '',
                errors: { root: [message || "Something went wrong. Please try again!"] },
            };
        }

        return {
            message: '',
            errors: {root:["Something went wrong. Please try again!"]},
        };
    }
};

interface Payload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

type LoginResponse = {
    message: string,
    errors?: Record<string, string[] | undefined>,
    isLoggedIn?: boolean,
    accessToken?: string,
    userId?: string,
    payload?:Payload
};

export const login =  async(
    state:{
        message: string | null, 
        errors?: Record<string, string [] | undefined>,
        isLoggedIn?:boolean,
        accessToken?: string | null,
        userId?: string | null
    },
        formData:FormData): Promise<LoginResponse> =>  {
    const inputValidation = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().nonempty('Password is required')
    })

    const formValues = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    try {
        inputValidation.parse(formValues);
        
        const {data} = await axiosPrivate.post("/login", { ...formValues });
        
        if (!data) {
        return { message: "", errors: data.errors || { root: ["Something went wrong. Please try again!"] } };
        }

        const {EmailMatch, PasswordMatch} = data;

        if (!EmailMatch) {
            return { message: "", errors: data.errors || { email: ["Email is invalid!"] } };
        }

        if (!PasswordMatch) {
            return { message: "", errors: data.errors || { password: ["Password is mismatch!"] } };
        }

        const {accessToken, payload} = data;
        
        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            path: "/",
            httpOnly: true, 
            secure: true,
            sameSite: "none",
            maxAge: 1 * 24 * 60 * 60, 
        });

        cookieStore.set("payload", JSON.stringify(payload), {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 1 * 24 * 60 * 60,
        });
        
        return {message:"Logged In Successfully",isLoggedIn:true, payload};

    } catch (error) {
        
        if (error instanceof z.ZodError) {
            
            return {
                message: '',
                errors: error.flatten().fieldErrors,
            };
        }

        if (error instanceof AxiosError) {
            const data = error.response?.data;

            if (!data?.message) {
                return {
                    message: '',
                    errors: { root: ["Something went wrong. Please try again!"] },
                };
            }
        }

        return {
            message: '',
            errors: {root:["Something went wrong. Please try again!"]},
        };
    }
}

export const logout = async (): Promise<{ message: string }> => {
    const cookieStore = await cookies();

    // Remove the accessToken and payload from cookies
    cookieStore.delete('accessToken');

    cookieStore.delete('payload');

    return { message: 'Logged out successfully' };
};

