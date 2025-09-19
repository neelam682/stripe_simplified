import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import PurchaseButton from "@/components/PurchaseButton";

const page = async () => {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const courses = await convex.query(api.courses.getCourses);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-foreground">All Courses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        className="flex flex-col bg-background border border-gray-300 rounded-xl !shadow-neumorph hover:!shadow-neumorph-inset transition-shadow duration-300"
                    >
                        {/* Image & Title */}
                        <Link href={`/courses/${course._id}`} className="cursor-pointer">
                            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-64 overflow-hidden rounded-t-xl">
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow p-4">
                                <h3 className="text-xl mb-2 hover:underline text-foreground">{course.title}</h3>
                            </div>
                        </Link>

                        {/* Price & Buttons */}
                        <div className="flex justify-between items-center px-4 py-3">
                            <Badge className="px-3 py-1 bg-black text-white rounded-lg !shadow-neumorph hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer">
                                ${course.price.toFixed(2)}
                            </Badge>

                            <SignedIn>
                                <PurchaseButton
                                    courseId={course._id}
                                />
                            </SignedIn>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button className="px-4 py-2 bg-black text-white rounded-lg !shadow-neumorph hover:bg-white hover:text-black transition-colors duration-300">
                                        Enroll Now
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default page;
