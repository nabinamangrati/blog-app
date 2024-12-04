'use client'
import Link from "next/link"
const Page=()=>{
  return (
    <>
     <div>welcome</div>
     <nav>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    </>
   
  )
}
export default Page