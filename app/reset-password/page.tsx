import EnviarMailResetPassword from "@/components/reset-password/enviarMail";
import RestablecerContraseña from "@/components/reset-password/restablecerContrasena";

interface SearchParams {
    token: string;
}

export default function Page(
    { searchParams }: Readonly<{ searchParams: SearchParams }>
) {
    if(!searchParams.token) {
        return <EnviarMailResetPassword />
    }
    return <RestablecerContraseña tokenServer={searchParams.token} />;
}