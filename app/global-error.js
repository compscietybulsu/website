"use client";

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body>
                <div>
                    <h2>Something went wrong during build!</h2>
                    <p>{error?.message}</p>
                </div>
            </body>
        </html>
    );
}