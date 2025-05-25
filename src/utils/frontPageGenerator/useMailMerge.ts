import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

function replaceErrors(_, value: any) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (
      error,
      key
    ) {
      error[key] = value[key];
      return error;
    },
    {});
  }
  return value;
}

export default function generateDocument(
  {
    content,
    data,
    outputName,
  }: {
    content: ArrayBuffer;
    data: {
      [key: string]: string | number;
    };
    outputName: string;
  },
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  var zip = new PizZip(content);
  var doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.setData(data);
  try {
    doc.render();
  } catch (error) {
    console.error(JSON.stringify({ error: error }, replaceErrors));

    if (
      error.properties &&
      error.properties.errors instanceof Array
    ) {
      const errorMessages = error.properties.errors
        .map(function (error) {
          return error.properties.explanation;
        })
        .join("\n");
      console.error("errorMessages", errorMessages);
      // errorMessages is a humanly readable message looking like this :
      // 'The tag beginning with "foobar" is unopened'
    }
    setError(error);
    setLoading(false);
  }
  var out = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }); //Output the document using Data-URI
  saveAs(out, outputName);
  setLoading(false);
}
