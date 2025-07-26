import { useEffect } from "react";

const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_PANEL_URL;

export default function Admin() {
    useEffect(() => {
        const adminPanel = ADMIN_PANEL_URL;
        window.open(adminPanel, "_blank");
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-svh text-center px-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Launching Admin Panel...</h1>
            <p className="text-lg">
                Admin Panel should open in a new tab. If it doesn’t,{" "}
                <a
                    href={ADMIN_PANEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-600/80"
                >
                    click here
                </a>
                .
            </p>
        </div>
    );
}
