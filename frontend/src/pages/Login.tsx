import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../service/api";

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await api.post("/login", data);
            const token = response.data.token;

            console.log(response.data);

            if (token) {
                localStorage.setItem("authToken", token);
                navigate("/");
            }
        } catch (error) {
            setErrorMessage("E-mail ou senha inválidos!");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="col-md-6 mx-auto border p-2 mt-5 rounded rounded-2">
                <h1 className="text-center">Login</h1>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}


                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control border border-warning text-white"
                        placeholder="E-mail"
                        aria-label="E-mail"
                        aria-describedby="button-addon2"
                        style={{ background: "#070607" }}
                        {...register("email", { required: "O e-mail é obrigatório" })}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control border border-warning text-white"
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="button-addon2"
                        style={{ background: "#070607" }}
                        {...register("password", { required: "A senha é obrigatória" })}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>

                <div className="col-12 mb-3">
                    <a href="/cadastrausuario" className="text-decoration-none ">Cadastrar Usuário</a>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                        {isSubmitting ? "Aguarde..." : "Acessar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;