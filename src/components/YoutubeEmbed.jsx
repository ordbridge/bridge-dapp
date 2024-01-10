import React, { memo } from "react";

const YoutubeEmbed = ({ embedId }) => {
  return (
    // <YouTube
    //   videoId={embedId}
    //   opts={opts}
    //   className="unisatSS_container"
    // />
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe
      title=""
      className="pr-4"
      width="100%"
      src="https://player.vimeo.com/video/839731536"
      frameborder="0"
      allow="autoplay"
      allowFullScreen
    ></iframe>
  );
};
export default memo(YoutubeEmbed);
