import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Dynamically import Form with SSR disabled
const Form = dynamic(() => import("@components/Form"), { ssr: false });

const UpdatePrompt = () => {
  const router = useRouter();
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${router.query.id}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (router.query.id) getPromptDetails();
  }, [router.query.id]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!router.query.id) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/${router.query.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <Form type="Edit" post={post} setPost={setPost} submitting={submitting} handleSubmit={updatePrompt} />;
};

export default UpdatePrompt;
