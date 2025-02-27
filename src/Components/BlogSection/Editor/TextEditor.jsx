import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import { Box, Spinner, useToast } from '@chakra-ui/react';
import draftToHtml from "draftjs-to-html";
import { ContentState } from 'draft-js';
import { convertFromHTML } from 'draft-js';
import { Parser } from 'html-to-react';
import axios from "axios";
import { ContextAPI } from '../../../ContextAPI/Context.API'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Tags from "../../Tags/Tags";
import { Token } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';


function TextEditor() {

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { id } = location.state || {};

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedFile, setSelectedFile] = useState(null);

  // const [contentHtml, setcontentHtml] = useState('');


  //image useState
  const [imagePreview, setImagePreview] = useState(null);


  //change for video
  //video useState
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [header, setHeader] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const toast = useToast();
  const { tags, setTags } = ContextAPI();

  const Token1 = localStorage.getItem('token');

  const [headerError, setHeaderError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    if (id) {
      // Define an async function within useEffect
      const fetchData = async () => {
        try {
          const response = await axios.post(`https://gautamsolar.us/admin/news/edit`, { uuid: id });
          // const response = await axios.post(`http://localhost:1008/admin/news/edit`, { uuid: id });
          const { Header, Description, Body, ImageURL, VideoUrl: VideoURL, Tags } = response.data.data;

          console.log(response?.data?.data)
          setHeader(Header);
          setDescription(Description);
          setSelectedFile(ImageURL);
          setImagePreview(ImageURL);
          setVideoPreview(VideoURL);
          setSelectedVideo(VideoURL);

          // Fetch the existing image from URL and set it as binary in selectedFile
          // try {
          // const imageResponse = await fetch(ImageURL);
          // const imageBlob = await imageResponse.blob();
          // console.log('this is imageBlob ',imageResponse);
          //   setSelectedFile(imageBlob); // Store binary data for submission
          //   setImagePreview(ImageURL); // Show image preview
          // } catch (error) {
          //   console.error("Error fetching image as binary:", error);
          // }

          // //change for video
          // //load video
          // if (VideoURL) {

          //   setVideoPreview(VideoURL); //showing video preview
          //   const videoResponse = await fetch(VideoURL);
          //   // console.log(videoResponse);
          //   setSelectedVideo(await videoResponse.blob()); // Store binary data for submission
          // }


          // Parse and format tags
          let parsedTagsArray = [];
          try {
            parsedTagsArray = Tags && Tags !== "[]" ? JSON.parse(Tags) : [];
          } catch (error) {
            console.error("Error parsing tags:", error);
          }

          const formattedTags = parsedTagsArray.map(tag => ({
            tag: tag.tag?.trim() || "",
            link: tag.link || ""
          }));

          setSelectedTags(formattedTags);
          setTags(formattedTags);

          // Set editor content from Body HTML
          const editorContent = Body
            ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Body)))
            : EditorState.createEmpty(); // Empty editor if Body is empty

          setEditorState(editorContent);
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      };


      // Call the async function
      fetchData();
    }
  }, [id]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      console.log(file);
      const reader = new FileReader(); //FileReader is a built-in JavaScript API that reads file contents asynchronously.
      reader.readAsDataURL(file);//The readAsDataURL(file) method reads the file and converts it into a Base64-encoded string.
      reader.onload = () => {
        resolve({ data: { link: reader.result } });
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);  // Update selectedFile
    setImagePreview(URL.createObjectURL(file));  // Update image preview
    // setVideoPreview(URL.createObjectURL(file));  //update image preview 
  };


  //change for video
  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedVideo(file);
    setVideoPreview(URL.createObjectURL(file));

  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };


  const publishBlog = async () => {
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const formData = new FormData();

  //  validation for header,description,video and image
    let flag=false;

    if (!header.trim()) {
      setHeaderError('Header is required');
      flag=true;
    }
    if (!description.trim()) {
      setDescriptionError('Description is required');
      flag=true;
    }

    if(selectedFile==null&&selectedVideo==null){
      toast({
        title: 'Error',
        description: "Image or video required",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      flag=true;
    }
    

     
    if(flag==false){

    formData.append("Header", header);
    formData.append("Description", description);
    formData.append("Body", contentHtml);
    formData.append("UUID", id || ""); // Use UUID if updating or create new entry
    formData.append('tags', JSON.stringify(tags));

    if (selectedFile) {
      formData.append("BlogImage", selectedFile);
    }


    //change for video
    if (selectedVideo) {
      formData.append("BlogVideo", selectedVideo);
    }
    
    // for updating the  existing data
    if (id !== undefined) {
      try {
        setLoading(true);
        await axios.patch(`https://gautamsolar.us/admin/updateNews/${id}`, formData, {
        // await axios.patch(`http://localhost:1008/admin/updateNews/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${Token1}`
          },
        });

        setLoading(false);

        toast({
          title: '',
          description: `Blog ${id ? "Updated" : "Created"} Successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });

      } catch (error) {
        setLoading(false);
        console.error("Error publishing blog:", error.message);
        toast({
          title: 'Error',
          description: "An error occurred while publishing the blog.",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    }

    // for creating the new one
    else {
      try {
        setLoading(true);
        await axios.post("https://gautamsolar.us/admin/createNews", formData, {
        // await axios.post("http://localhost:1008/admin/createNews", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${Token1}`
          },
        });

        setLoading(false);

        toast({
          title: '',
          description: `Blog ${id ? "Updated" : "Created"} Successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });

        // Reset form after submission
        setSelectedFile(null);

        //change for video
        setSelectedVideo(null);
        // set both video and image to null so that after creating a blog there is no preview of video and image
        setImagePreview(null);
        setVideoPreview(null);

        setHeader("");
        setDescription("");
        setEditorState(EditorState.createEmpty());

      } catch (error) {
        setLoading(false);
        console.error("Error publishing blog:", error.message);
        toast({
          title: 'Error',
          description: "An error occurred while publishing the blog.",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    }
  }

  };


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontWeight: "700" }}>Upload Blog</h2>

      <h2 style={{ marginTop: "20px" }}>Upload Image</h2>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #cccccc",
          borderRadius: "5px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >

        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Blog Preview"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <p style={{ fontWeight: "bold", fontSize: "large" }}>
              {selectedFile ? selectedFile.name : "No file selected"}
            </p>
          </>
        ) : (
          <p>No image selected</p>
        )}
        <input
          type="file"
          id="fileInput"
          accept="*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          <u>{imagePreview ? "Change Image" : "Click to Select Image"}</u>
        </label>
      </div>


      {/* change for video  */}
      {/* Video Upload */}
      <h2 >Upload Video</h2>
      <div style={{
        border: "2px dashed #cccccc",
        borderRadius: "5px",
        padding: "20px",
        textAlign: "center",
        marginBottom: "20px",
      }}>

        {videoPreview ? (
          <>
            <video controls width="300" height="200" autoPlay loop style={{ borderRadius: "8px", marginBottom: "10px" }}>
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>{selectedVideo ? selectedVideo.name : "No file selected"}</p>
          </>
        ) : <p>No video selected</p>}

        <input type="file" id="videoInput" accept="video*" style={{ display: "none" }} onChange={handleVideoChange} />

        <label htmlFor="videoInput" style={{ cursor: "pointer" }}><u>{videoPreview ? "Change Video" : "Click to Select Video"}</u></label>
      </div>
      {/* header */}
      <div>
        <label htmlFor="header" style={{ marginRight: "10px" }}>
          Header:
        </label>
        <input
          type="text"
          id="header"
          value={header}
          onChange={(e) => {
            setHeaderError('');
            setHeader(e.target.value)
          }}
          style={{
            marginBottom: "7px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            fontSize: "16px",
          }}
        />
        <span style={{ fontSize: '13px', color: 'red' }}>{headerError ? headerError : ''}</span>
      </div>
      <div>

        <label htmlFor="description" style={{ marginRight: "10px" }}>
          Description:
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => {
            setDescriptionError('')
            setDescription(e.target.value)
          }}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            fontSize: "16px",
          }}
        />
        <span style={{ fontSize: '13px', color: 'red' }}>{descriptionError ? descriptionError : ''}</span>
      </div>

      <div style={{ marginTop: "15px" }}>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'link', 'textAlign', 'image'],
            link: { inDropdown: false },
            image: {
              //change for showing image
              uploadCallback: uploadImageCallBack,
              previewImage: true,
              alt: { present: true, mandatory: false },

              defaultSize: { //default size of image
                height: "200px",
                width: "auto"
              }
            },

          }}
          wrapperStyle={{
            border: "2px solid black",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            width: "100%",
            minHeight: "400px",
          }}
          editorStyle={{
            height: "calc(100% - 40px)",
            padding: "8px",
            overflow: "auto",
            maxHeight: "calc(100% - 40px)",
          }}
        />
      </div>

      <Tags />

      <div style={{ marginTop: "8px" }}>
        <button
          onClick={publishBlog}
          style={{
            cursor: "pointer",
            background: "#A20000",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 16px",
            border: "none",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#FF6347")}
          onMouseLeave={(e) => (e.target.style.background = "#5DADE2")}
        >
          {loading ?
            <Spinner />
            :
            'Publish '
          }
        </button>

      </div>
    </div>
  );
}

export default TextEditor;
