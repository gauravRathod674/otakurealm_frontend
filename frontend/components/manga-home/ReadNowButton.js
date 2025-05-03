import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlasses,
} from "@fortawesome/free-solid-svg-icons";

function ReadNowButton({ mangaTitle }) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await axios.get(
        `/api/get-read-path?title=${encodeURIComponent(mangaTitle)}`
      );
      const { success, read_path } = response.data;

      if (success && read_path) {
        router.push(`/read/${read_path}`);
      } else {
        alert("Could not find the latest chapter. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while fetching read path.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-5 py-2 text-lg bg-[#ba574f] text-black rounded-full flex items-center gap-2 hover:bg-[#bb5052] font-semibold"
    >
      <span className="font-bold mr-2">
        <FontAwesomeIcon icon={faGlasses} />
      </span>
      Read now
    </button>
  );
}

export default ReadNowButton; 