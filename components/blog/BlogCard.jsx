import Link from "next/link";
import GradientPillButton from "@/components/ui/GradientPillButton";

function excerpt(text, length = 220) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export default function BlogCard({ blog }) {
  return (
    <div className="grid sm:grid-cols-2 gap-6 items-start mb-10">
      <Link href={`/blog/${blog._id}`} className="block">
        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden">
          {blog.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          )}
        </div>
      </Link>
      <div className="flex flex-col items-start">
        <Link href={`/blog/${blog._id}`}>
          <h3 className="font-heading font-extrabold text-green-400 text-2xl sm:text-3xl mb-3 hover:text-green-300 transition-colors">
            {blog.title}
          </h3>
        </Link>
        <p className="text-green-100/80 text-sm leading-relaxed mb-5">{excerpt(blog.content)}</p>
        
        <div className="flex flex-row w-lg">
          <GradientPillButton href={`/blog/${blog._id}`} >Read More</GradientPillButton>
        </div>
      </div>
    </div>
  );
}