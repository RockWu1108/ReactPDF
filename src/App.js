import React, { useState , Component } from 'react';
import ReactDOM from 'react-dom';
import { Document, Page, pdfjs} from "react-pdf";
import pdf2base64 from 'pdf-to-base64';
import samplePdf from './sample.pdf'

 class App extends Component{
        constructor(props) {
            super(props);
            this.state = {
                numPages : 0,
                pageNumber: 0,
                localFile :'',
                baseUrl:"",
                pdfState:false,
            }
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        }
    //onDocumentLoadSuccess：成功加載文檔後，設置頁碼告知用戶pdf所在的頁碼。
    onDocumentLoadSuccess = ({numPages})=> {
        this.setState({numPages:numPages});
        console.log("numPages",numPages);
    }

     getLocalFile = (e) => {
        //1.Read the file using file reader
        let file = e.target.files[0];
        let fileReader = new FileReader();
        let typedArray=null;
        fileReader.onload = (e)=>{
            //3.turn array buffer into typed array
             typedArray = new Uint8Array(e.target.result);
        }
        // 2.Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);
    }

     getUrl = (e) =>{

         this.setState((currentState) =>({
             baseUrl : e.target.value ,
             pageNumber: currentState.pageNumber +1 }));
             console.log(this.state.pdfState);
     }

     changePage = (offset) =>{
            const range = this.state.pageNumber + offset ;
            console.log("Range",range);
            if(range > 0 && range <= this.state.numPages){
                this.setState((currentState) =>({
                    pageNumber : range
                }));
            }
            else{
                alert("Out of range")
            }
     }

     previousPage = ()=>{
         this.changePage(-1)
     }

     nextPage = () =>{
         this.changePage(1)
     }

     getLocalPDF = (e) =>{
        if(this.state.localFile !==null){
            this.setState({localFile : e.target.files[0],
            pageNumber : 1});
        }

        else{
            this.setState({localFile : ""});
         }
     }

        render () {
            //防止cros錯誤
            const CROS_URL = "https://cors-anywhere.herokuapp.com/" ;

            return(
                <div>
                    <div style={{margin :"30px"}}>
                        <input type="text" onChange={this.getUrl} value={this.state.baseUrl} style={{width : "400px" , height : "30px" , marginBottom :"20px"}} placeholder="1. 請輸入PDF網址查詢"/>
                        <br/>
                        <label >2. 讀取本地PDF檔案:</label>
                        <input id="file" type="file" onChange={this.getLocalPDF}/>
                        <br/>
                        <br/>
                        {this.state.baseUrl ? <h3>{this.state.baseUrl}</h3> :""}
                        <br/>
                        <button onClick={this.previousPage} style={{marginRight : "10px"}}>Previous Page</button>
                        <button onClick={this.nextPage}>Next Page</button>
                        <br/>
                        {(this.state.pageNumber !== 0 && (this.state.baseUrl!=="" || this.state.localFile !==""))  ? <h3>{"Page " + this.state.pageNumber + " of " + this.state.numPages}</h3> : ""}
                    </div>

                    <div>
                        {
                        this.state.baseUrl ?
                            <div>
                                <Document
                                    file={CROS_URL + this.state.baseUrl}
                                    options={{workerSrc: "/pdf.worker.js"}}
                                    onLoadSuccess={this.onDocumentLoadSuccess}
                                >
                                <Page pageNumber={this.state.pageNumber}
                                />
                            </Document>
                            </div> : ""
                        }
                        {
                            this.state.localFile ?
                                <div>
                                    <Document
                                        file={this.state.localFile}
                                        options={{workerSrc: "/pdf.worker.js"}}
                                        onLoadSuccess={this.onDocumentLoadSuccess}
                                    >
                                        <Page pageNumber={this.state.pageNumber}   />
                                    </Document>
                                </div> : ""
                        }
                    </div>
                </div>
            );
        }
}


export default App;
