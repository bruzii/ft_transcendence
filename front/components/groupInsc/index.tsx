import { Form, Container, Grid1, BubbleArrowBlack, GroupInput, Button, Select, TitleCategorie, SubCategorie, Input } from "../Form/styles";
import { useQuery } from "@apollo/client";
import { FlexCol, Label2 } from "../../themes/styles";
import { SiMicrosoftexcel } from 'react-icons/si';
import { useState, useEffect} from "react";
import { CREATE_FORM_GROUP } from "../../Apollo/mutations/form";
import { useMutation } from "@apollo/client";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";

interface formatedData  {
    id?: string;
    userName: string;
    lastName: string;
    hotelType: string;
    email?: string;
    tel: string;
    city: string;
    passeport: string;
    passportExpirationDate: string;
    dateOfBirth: string;
    country: string;
    foodChoice: string[];
    allergies: string;
    roomMate: string[];
    specialRequests: string;
    eventName: string;
}
const FormGroupInsc = ({ eventName }: string) => {
    const [Selected, setSelectedFile] = useState<string | null>(null);
    // const [excelFile, setExcelFile] = useState<any>(null);
    const [typeError, setTypeError] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<unknown[] | null>(null);
    const [createFormMutation, {error : error2, loading, data}] = useMutation(CREATE_FORM_GROUP);
    console.log(JSON.stringify(error2, null, 2));
    const HandleUplaod = (excelFile : any) => {
        console.log("excelFile ", excelFile);
        if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(" XLSX.utils.sheet_to_json(worksheet) ", data);
        setExcelData(data);
        console.log("excelData", excelData);
        // setValue("personAuthorized", data);
        }
    }
    let formatedData: formatedData[] = [];
    const Formated = (data: string[][]) => {
        data?.forEach((row, index) => {
          if (index > 0) {
            formatedData[index - 1] = {
              hotelType: row[1],
              lastName: row[2],
              userName: row[3],
              tel: row[4],
              city: row[5],
              country: row[6],
              passportExpirationDate: row[7],
              passeport: row[8] ? row[8] : "",
              dateOfBirth: row[9],
              roomMate: [row[10], row[11]],
              foodChoice: row[12] ? row[12].split(",") : [],
              allergies: row[13] ? row[13] : "",
              specialRequests: row[14] ? row[14] : "",
              eventName: eventName,
              email: row[15],
            };
          }
        });
      
        console.log("FormatedData ", formatedData);
      };
      console.log("event ", eventName)
    Formated(excelData as string[][])
    const handleExcelUpload = (e: any) => {
        let fileTypes = [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ];
        let selectedFile = e.target.files[0];
        console.log("selectedFile ", selectedFile);
        if (selectedFile) {
          if (selectedFile && fileTypes.includes(selectedFile.type)) {
            setSelectedFile(selectedFile.name);
            setTypeError(null);
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = (e) => {
              if (e.target) {
                console.log("e.target.result ", e.target);
                // setExcelFile(e.target.result);
                HandleUplaod(e.target.result)
              }
            };
    
          } else {
            setTypeError("Please select only excel file types");
            // setExcelFile(null);
            setSelectedFile(null);
          }
        } else {
          console.log("Please select your file");
        }
      };

      const HandleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            console.log("Data  " + JSON.stringify(excelData));
            console.log("formatedData  " , formatedData);
            const { data } = await createFormMutation({
                variables: { 
                input: formatedData },
            });
            console.log("data ", data);
            toast.success("Excel uploaded successfully");
        } catch (err) {
            console.log(" ERRREUR " + err);
            toast.error(<b>{error2?.graphQLErrors[0]?.message}!</b>)
        }
    }
      useEffect(() => {
        console.log("excelData", excelData);
      }, [excelData]);

    return (
        <Container>
            <Form onSubmit={HandleSubmit}>
            <FlexCol >
                  <Label2>Participants a l'evenement</Label2>
                  <Label2 htmlFor="file-input">
                    {Selected
                      ? Selected.substring(0, 20) + "..."
                      :   <FlexCol> 
                            <SiMicrosoftexcel size={30} color="green"/>
                            Choisir un Excel 
                          </FlexCol> }
                  </Label2>
                  <Input
                    type="file"
                    id="file-input"
                    name="file-input"
                    style={{ width: "140px", display: "none" }}
                    accept=".xlsx"
                    onChange={handleExcelUpload}
                  />
                </FlexCol>
                <Button type="submit">Envoyer</Button>
                <Toaster position="top-right" reverseOrder={false} />
            </Form>
        </Container>
    )
}

export default FormGroupInsc