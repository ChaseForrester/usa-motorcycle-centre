export default function NoTenantPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
            <div>
                <h1 className="text-3xl font-semibold">This host is not a shop.</h1>
                <p className="mt-3 text-zinc-400">Point the domain at a tenant record and try again.</p>
            </div>
        </div>
    );
}
