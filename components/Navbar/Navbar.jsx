import React from "react";
import "./Navbar.css";
import Sound from "react-sound";
export default function Navbar(props) {
  return (
    <div className="navbar">
      <h2>Hierarchical Todo List App</h2>
      <Sound
        url="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"
        playStatus={Sound.status.PLAYING}
        playFromPosition={300 /* in milliseconds */}
        // onLoading={this.handleSongLoading}
        // onPlaying={this.handleSongPlaying}
        // onFinishedPlaying={this.handleSongFinishedPlaying}
      />
    </div>
  );
}
