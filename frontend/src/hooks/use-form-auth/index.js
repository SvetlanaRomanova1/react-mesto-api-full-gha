import {useState} from "react";

export function UseFormAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        setLoading
    };
}
