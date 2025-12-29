import React, { useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import dog from "../assets/osm.webp";
import dog_xss from "../assets/dont_xss.gif";
import "../components/search.css";

const api_url = import.meta.env.VITE_API_URL;

const Subdomain = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([{ fullResult: "https://mail.google.com" }]);
  const [trace, setTrace] = useState(false);
  const [stream, setStream] = useState(null);
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(null);
  const [buttonTrace, setButtonTrace] = useState(false);

  // set the flag
  const setReqFlag = () => {
    console.log("click");
    console.log("value is ",value);
    setButtonTrace((prev) => !prev);
  };

  useEffect(() => {
    if (buttonTrace) {
      setFlag("status-code");
    } else {
      setFlag(null);
    }
  }, [buttonTrace]);

  let refd = useRef(null);

  function show_Message_Img() {
    if (msg == "") return "";
    if (msg === "Seriously are you try xss...") {
      return <img className="w-[200px] h-[230px]" src={dog_xss} alt="" />;
    }
    if (msg != "") {
      return <img className="w-[200px] h-[200px]" src={dog} alt="" />;
    }
  }

  // for the cancel request
  const cancelRequest = async () => {
    try {
      if (stream) {
        setTrace(false);
        setMsg("");
        refd.current.style.display = "none";
        stream.close();
        await axios.post(`${api_url}/cancel`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // server on to sleep mode
  useEffect(() => {
    fetch(`${api_url}/sleep`);
  }, []);

  // for the send request
  const sendRequest = async () => {
    if (!value || value.trim() == "") return;
    setData([]);
    setMsg("");
    setTrace(true);
    refd.current.style.display = "block";
    const eventSource = new EventSource(
      `${api_url}/subdomain?domainName=${value}&flag=${flag}`
    );

    setStream(eventSource);

    eventSource.onmessage = (event) => {
      let raw = event.data;
      raw = raw.replace("data: ", "");
      raw = raw.trim();
      raw = JSON.parse(raw);
      const final_data = JSON.parse(raw);
      if (final_data.success === false) {
        // console.log("false trigged huaa hai");
        refd.current.style.display = "none";
        setMsg(final_data.msg);
        setTrace(false);
        return;
      }

      refd.current.style.display = "block";
      setData((data) => [...data, final_data]);
    };

    eventSource.addEventListener("end", () => {
      // console.log("Scan completed");
      eventSource.close();
      refd.current.style.display = "none";
      setTrace(false);
    });

    eventSource.onerror = () => {
      refd.current.style.display = "none";
      // console.log("Error in stream");
      eventSource.close();
    };
  };

  return (
    <div
      style={{ marginTop: "20px" }}
      className="w-full flex justify-center items-center flex-col"
    >
      <div className="w-full flex justify-center items-center mt-5 flex-col gap-4">
        <div className="flex justify-center items-center flex-col w-[70vw]">
          <h1 className="text-amber-500 font-bold">Important Warning</h1>
          <span>
            This tool is intended strictly for educational and authorized
            security testing purposes only. You may use it only on domains you
            own or on systems where you have explicit permission to test.
            Unauthorized scanning, reconnaissance, or subdomain enumeration on
            external websites is illegal and may result in severe legal
            consequences. All actions performed using this tool are the sole
            responsibility of the user.
          </span>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <input 
            onChange={(e) => {
              setValue(e.target.value);
            }}
            style={{ border: "2px solid green", color:"#8b10cd"}}
            className="outline-none w-[40vw] p-1.5 pl-3 rounded-2xl text-2xl"
            type="text"
            placeholder="Search domain :- google.com"
            value={`${value.trim()}${flag ? " " + flag : ""}`}
          />
          <button
            onClick={() => {
              if (!trace) {
                sendRequest();
              } else {
                cancelRequest();
              }
            }}
            className="cursor-pointer"
          >
            {!trace ? <IoMdSearch size={35} /> : "cancel"}
          </button>
        </div>
        <div style={{ display: "none" }} ref={refd} className="loader"></div>
        {
          <span
            style={{ color: "red", opacity: 0.6 }}
            className="text-2xl text-red-500"
          >
            {msg}
          </span>
        }

        {show_Message_Img()}
      </div>
      <div className="w-1/2 flex gap-2">
        {/*disabled={trace ? true : false}*/}
        <label className="inline-flex items-center cursor-pointer">
          <input
            disabled={trace || value == "" ? true : false}
            onChange={setReqFlag}
            type="checkbox"
            className="sr-only peer focus:outline-none focus:ring-0"
          />

          <div
            className="
      relative w-9 h-5
      rounded-full
      bg-gray-600
      transition-colors duration-300
      border-2 border-red-400

      peer-checked:bg-brand
      peer-disabled:bg-gray-200
      peer-disabled:cursor-not-allowed

      peer-focus:outline-none
      peer-focus:ring-0

      after:content-['']
      after:absolute after:top-[2px] after:left-[2px]
      after:h-4 after:w-4
      after:bg-white after:rounded-full
      after:transition-transform duration-300
      peer-checked:after:translate-x-4
    "
          ></div>

          <span className="select-none ms-3 text-sm font-medium text-heading">
            status-code
          </span>
        </label>
      </div>
      <div
        style={{
          border: "2px solid green",
          marginTop: "20px",
          padding: "0px 100px",
        }}
        className="w-1/2 flex flex-col gap-2 p-3"
      >
        {/* result */}
        <span className="text-2xl">Result</span>
        {data.map((data, index) => {
          return (
            <div
              key={index}
              style={{ fontSize: "130%" }}
              className="flex gap-2"
            >
              <span>Live :- </span>
              <a href={data.fullResult}>{data.fullResult}</a>
              {data.status >= 200 && data.status < 300 ? (
                <span style={{ color: "green" }}>{data.status}</span>
              ) : data.status >= 300 && data.status < 400 ? (
                <span style={{ color: "yellow" }}>{data.status}</span>
              ) : (
                <span style={{ color: "red" }}>{data.status}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subdomain;
