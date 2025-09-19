"use client"

import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { Skeleton } from "../../../components/ui/skeleton"
import { Card, CardHeader, CardContent, CardTitle } from "../../../components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileTextIcon, PlayCircle, Lock } from "lucide-react"
import PurchaseButton from "@/components/PurchaseButton"

const CourseDetailPage = ({ params }: { params: { courseId: Id<"courses"> } }) => {
    const { user, isLoaded: isUserLoaded } = useUser()

    const userData = useQuery(api.users.getUserByClerkId, { clerkId: user?.id ?? "" })
    const courseData = useQuery(
        api.courses.getCourseById,
        params?.courseId ? { courseId: params.courseId } : "skip"
    )
    const userAccess =
        useQuery(
            api.users.getUserAccess,
            userData ? { userId: userData?._id ?? "", courseId: params.courseId } : "skip"
        ) || { hasAccess: false }

    if (!isUserLoaded || courseData === undefined) {
        return <CourseDetailSkeleton />
    }

    if (courseData === null) {
        return <div>Not found</div>
    }

    return (
        <div className="container mx-auto py-8 px-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Image
                        src={courseData.imageUrl}
                        alt={courseData.title}
                        width={1200}
                        height={600}
                        className="w-full object-cover rounded-md"
                    />
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-3xl font-bold mb-4">{courseData.title}</CardTitle>

                    {userAccess.hasAccess ? (
                        <>
                            <p className="text-gray-700 mb-6">{courseData.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <Button className="flex items-center justify-center space-x-2">
                                    <PlayCircle className="w-5 h-5" />
                                    <span>Start Course</span>
                                </Button>

                                <Button className="flex items-center justify-center space-x-2" variant="outline">
                                    <Download className="w-5 h-5" />
                                    <span>Download Materials</span>
                                </Button>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <FileTextIcon className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">Introduction to Advanced Patterns</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">Hooks and Custom Hooks</span>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <Lock className="w-16 h-16 text-gray-400" />
                                <p className="text-gray-700 mb-4">
                                    You do not have access to this course. Please purchase to gain access.
                                </p>
                                <p className="text-2xl font-bold text-gray-900 mb-4">This course is Locked</p>
                                <p className="text-gray-600 mb-6">${courseData.price.toFixed(2)}</p>
                                <PurchaseButton courseId={params.courseId} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default CourseDetailPage

function CourseDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto ">
                <CardHeader>
                    <Skeleton className="w-full h-[600px] rounded-md" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-3/4 h-10 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-2/3 h-4 mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
