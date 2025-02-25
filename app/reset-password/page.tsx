import EnviarMailResetPassword from "@/components/reset-password/enviarMail";
import RestablecerContraseña from "@/components/reset-password/restablecerContrasena";

interface searchParams {
    token: string;
}

export default function Page(
    { searchParams }: Readonly<{ searchParams: searchParams }>
) {
    if(!searchParams.token) {
        return <EnviarMailResetPassword />
    }
    return <RestablecerContraseña tokenServer={searchParams.token} />;
}