import React from "react";
import ReactDOM from 'react-dom';

type UserProfileImageProps = {
  username: any;
}

class UserProfileImage extends React.Component<UserProfileImageProps> {

    fetchUserImage() {
        // fetch(`${/*Put User Image Profile */}`, {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       username: this.props.username,
        //     }),
        //   })
        //     .then((res) => {
        //         console.log("Success:", res.json());
        //         return res.json();
        //     });
    }

    render() {
        return (
            <img src=""/>
          );
    }
}

export default UserProfileImage;