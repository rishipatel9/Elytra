import { redirect } from 'next/navigation'

const page = () => {
    redirect("admin/login")
    return null
}

export default page
