
'use client';
import useAuth from "@/features/base/auth/hooks/use-auth";

const TestPage = () => {
    const {user} =  useAuth()
    console.log('subaseUser', user)
    return (
        <div>
        <h1>Test Page</h1>
        </div>
    )
}
export default TestPage