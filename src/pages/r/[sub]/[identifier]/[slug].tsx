import useSWR from "swr";
import { Post } from "../../../../types";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import { useAuthState } from "../../../../context/auth";
import { FormEvent, useState } from "react";
import axios from "axios";

const PostPage = () => {
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { authenticated, user } = useAuthState();
    const [newComment, setNewComment] = useState("");

    const { data: post, error } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);
    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if(newComment.trim() === "") {
            return;
        }

        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
                body: newComment
            });
            setNewComment("");
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">
                <div className="bg-white rounded">
                    {post && (
                        <>
                            <div className="flex">
                                <div className="py-2 pr-2">
                                    <div className="flex items-center">
                                        <p className="text-xs test-gray-400">
                                            Posted By
                                            <i className="fas fa-solid fa-pen"></i>
                                            <Link href={`/u/${post.username}`}
                                                className="mx-1 hover:underlinke"    
                                            >
                                                {post.username}
                                            </Link>
                                            <Link href={post.url}
                                                className="mx-1 hover:underline"
                                            >
                                                {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                                            </Link>
                                        </p>
                                    </div>
                                    <h1 className="my-1 text-xl font-medium">
                                        {post.title}
                                    </h1>
                                    <p className="my-3 text-sm">{post.body}</p>
                                    <div className="flex">
                                        <button>
                                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                            <span className="font-bold">
                                                {post.commentCount} Comments
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* 댓글 작성 구간 */}
                                <div className="pr-6 mb-4">
                                    {authenticated ? 
                                        // 로그인이 되었을 때
                                        (
                                            <div>
                                                <p className="mb-1 text-xs">
                                                    <Link 
                                                        className="font-semibold text-blue-500"
                                                        href={`/u/${user?.username}`}
                                                    >
                                                        {user?.username}
                                                    </Link>
                                                    {" "}으로 댓글 작성
                                                </p>
                                                <form onSubmit={handleSubmit}>
                                                    <textarea 
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                        onChange={e => setNewComment(e.target.value)}
                                                        value={newComment}
                                                    ></textarea>
                                                    <div className="flex justify-end">
                                                        <button
                                                            className="px-3 py1 text-white bg-gray-400 rounded"
                                                            disabled={newComment.trim() === ""}
                                                        >
                                                            댓글 작성
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : 
                                        // 로그인이 안되었을 때
                                        (
                                            <div className="flex items-center justify-between px-2 py-4 border border-gray-200">
                                                <p className="font-semibold text-gray-400">
                                                    댓글 작성을 위해서 로그인 해주세요
                                                </p>
                                                <div>
                                                    <Link href={`/login`}
                                                        className="px-3 py-1 text-white bg-gray-400 rounded"
                                                    >
                                                        로그인
                                                    </Link>
                                                </div>
                                            </div>

                                        )}
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;