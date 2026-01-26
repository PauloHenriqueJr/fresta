import { toast } from "@/hooks/use-toast";

/**
 * Attempts to share content using the Web Share API, including images if provided.
 */
export async function shareContent({
  title,
  text,
  url,
  imageUrl,
}: {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}) {
  const shareData: ShareData = {
    title,
    text,
    url,
  };

  try {
    // If there's an image, try to fetch it and share as a file
    if (imageUrl && navigator.canShare && navigator.canShare({ files: [new File([], "test.png")] })) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "fresta-momento.png", { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          shareData.files = [file];
          // On many platforms, if files are present, url/text might be ignored or handled differently
          // so we keep them just in case.
        }
      } catch (e) {
        console.error("Error fetching image for share:", e);
      }
    }

    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url);
      return "copied";
    }
  } catch (error) {
    if ((error as any).name !== 'AbortError') {
      console.error("Error sharing:", error);
    }
    return false;
  }
}
