'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState<{ success: boolean, message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setState(null);

        // Get form data
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            // Simulate a brief delay for authentication
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check email and redirect accordingly
            switch (email.toLowerCase()) {
                case 'hospital.admin@gmail.com':
                    setState({ success: true, message: 'Login berhasil! Mengarahkan...' });
                    setTimeout(() => router.push('/hospital'), 1500);
                    break;
                case 'distributor.admin@gmail.com':
                    setState({ success: true, message: 'Login berhasil! Mengarahkan...' });
                    setTimeout(() => router.push('/distributor'), 1500);
                    break;
                default:
                    setState({ success: false, message: 'Email atau password anda salah.' });
            }
        } catch (error) {
            setState({ success: false, message: 'Terjadi kesalahan.' });
            console.log('error', error)
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Masukkan email dan password anda</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Masukkan email"
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            placeholder="Masukkan password"
                            required 
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isPending}>
                        {isPending ? 'Memproses...' : 'Masuk'}
                    </Button>
                    {state && (
                        <div className={`w-full p-3 rounded-md ${state.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} flex items-center justify-center`}>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <p className="text-sm">{state.message}</p>
                        </div>
                    )}
                </CardFooter>
            </form>
        </Card>
    )
}