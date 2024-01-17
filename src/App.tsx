import { useEffect, useState } from "react";

declare const JSZip: any;

function App() {
  const [image, setImage] = useState<any>([]);
  const [type, setType] = useState<string>("webp");
  const [quality, setQuality] = useState<number>(0.8);
  const [maxWidth, setWidth] = useState<number>(320);
  const [maxHeight, setHeight] = useState<number>(180);
  const [files, setFile] = useState<any>([]);

  useEffect(() => {
    setImage([]);
    files.map((file: any) => {
      const canvas: any = document.createElement("canvas");
      if (!canvas) return;
      const img: any = new Image();

      const ctx = canvas.getContext("2d");
      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/" + type, 0.8);
        setImage((prv: any) => [...prv, dataUrl]);
      };
      img.src = file;
    });
  }, [files, quality, maxWidth, maxHeight, type]);

  const onload = function (e: any) {
    setFile((prv: any) => [...prv, e.target.result]);
  };

  function handleImage() {
    setImage([]);
    const input: any = document.getElementById("imageInput");
    if (!input) return;
    const files = [...input.files];

    files.map((file: any) => {
      const reader: any = new FileReader();
      reader.onload = (e: any) => onload(e);
      reader.readAsDataURL(file);
    });
  }

  async function downloadImage() {
    if (image.length === 0) return;

    const link = document.createElement("a");

    if (image.length === 1) {
      link.href = image[0];
      link.download = `resized_image.${type}`;
    } else if (image.length > 1) {
      const zip = new JSZip();
      image.map((img: any, index: number) => {
        const imgName = `image${index}.${type}`;
        zip.file(imgName, img.split(",")[1], { base64: true });
      });
      try {
        const blob = await zip.generateAsync({ type: "blob" });
        link.href = URL.createObjectURL(blob);
        link.download = "resized_images.zip";
      } catch (error) {
        document.body.removeChild(link);
        console.log(error);
        return;
      }
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                FILES
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <input
                  type="file"
                  id="imageInput"
                  accept="image/jpg, image/jpeg, image/png"
                  onChange={handleImage}
                  multiple
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                QUALITY
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <input
                  type="number"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {" "}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontWeight: "600",
                  }}
                >
                  WIDTH
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={e => {
                      setWidth(Number(e.target.value));
                      setHeight(Number(e.target.value) / (16 / 9));
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontWeight: "600",
                  }}
                >
                  HEIGHT
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={e => {
                      setHeight(Number(e.target.value));
                      setWidth(Number(e.target.value) * (16 / 9));
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                OUTPUT TYPE
              </div>
              <div
                style={{
                  flex: 1,
                }}
              >
                <input
                  type="text"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{
                    flex: 1,
                  }}
                />
              </div>
            </div>
          </div>

          <button onClick={downloadImage}>Download</button>
          <button onClick={() => setImage([])}>Clear</button>

          <div>
            {image &&
              image.length > 0 &&
              image.map((img: any, idx: number) => {
                return (
                  <img
                    src={img}
                    alt="img"
                    key={idx}
                    style={{
                      width: "300px",
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
