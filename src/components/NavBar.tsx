import Link from "next/link";
import React from "react";
import { useAuthState } from "../context/auth";
import axios from "axios";
import { useAuthDispatch } from "../context/auth";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

const NavBar: React.FC = () => {
    const { loading, authenticated } = useAuthState();
    const dispatch = useAuthDispatch();

    const handleLogout = () => {
        axios
            .post("/auth/logout")
            .then(() => {
                dispatch("LOGOUT");
                window.location.href="/"
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
            <span className="text-2xl font-semibold text-gray-400">
                <Link href="/">
                    <Image
                        src="/lebronLogo.jpeg"
                        alt="HOME"
                        width={40}
                        height={20}
                    />
                </Link>
            </span>
            <div className="max-w-full px-4">
                <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
                    <FaSearch className="ml-2 text-gray-400"/>
                    <input type="text" placeholder="Search" className="px-3 py-1 bg-transparent h-7 rounded focus:outline-none" />
                </div>
            </div>
            <div className="flex">
                {!loading &&
                    (authenticated ? (
                        <button className="w-20 p-2 mr-2 text-center border rounded border-white-500 text-white bg-gray-400" onClick={handleLogout}>
                            로그아웃
                        </button>
                    ) : (
                        <>
                            <Link className="w-20 p-2 mr-2 text-center text-blue-500 border border-blue-500 rounded" href="/login">
                                로그인
                            </Link>
                            <Link className="w-20 p-2 text-center text-white bg-gray-400 rounded" href="/register">
                                회원가입
                            </Link>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default NavBar;
