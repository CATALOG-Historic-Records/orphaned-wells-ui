"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[588],{9561:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>g,contentTitle:()=>p,default:()=>m,frontMatter:()=>u,metadata:()=>n,toc:()=>v});const n=JSON.parse('{"id":"guide","title":"OGRRE Guide","description":"OGRRE is a web-based graphical user interface.","source":"@site/docs/guide.mdx","sourceDirName":".","slug":"/guide","permalink":"/orphaned-wells-ui/docs/guide","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"OGRRE Guide","sidebar_position":2},"sidebar":"tutorialSidebar","previous":{"title":"Introduction to OGRRE","permalink":"/orphaned-wells-ui/docs/intro"}}');var r=i(4848),d=i(8453);const s=i.p+"assets/images/project-export-528d51b1bb99f745bae9fdf3024dc0e8.png",o=i.p+"assets/images/project-list-5208be3bf95e05a0a23fe371e8854fd3.png",l=(i.p,i.p+"assets/images/project-review-8ab850c0827e3b6034323d5d049a04e4.png"),c=i.p+"assets/images/project-view-d2d7bb55cabda16cc4a01dab8783b72d.png";function a(){return(0,r.jsx)("img",{src:s})}function h(){return(0,r.jsx)("img",{src:o})}function x(){return(0,r.jsx)("img",{src:l})}function j(){return(0,r.jsx)("img",{src:c})}const u={title:"OGRRE Guide",sidebar_position:2},p="OGRRE Guide",g={},v=[{value:"Overview",id:"overview",level:2},{value:"Terminology",id:"terminology",level:2},{value:"Login",id:"login",level:2},{value:"Choose a project",id:"choose-a-project",level:2},{value:"Choose a record",id:"choose-a-record",level:2},{value:"Review/edit record",id:"reviewedit-record",level:2},{value:"Layout",id:"layout",level:3},{value:"Contents",id:"contents",level:3},{value:"Actions",id:"actions",level:3},{value:"Review status",id:"review-status",level:3},{value:"Export records",id:"export-records",level:2},{value:"Exit / Sign out",id:"exit--sign-out",level:2}];function w(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",mermaid:"mermaid",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"ogrre-guide",children:"OGRRE Guide"})}),"\n",(0,r.jsx)(t.p,{children:"OGRRE is a web-based graphical user interface.\nIt should function well in any modern web browser."}),"\n",(0,r.jsx)(t.admonition,{type:"note",children:(0,r.jsxs)(t.p,{children:["This guide describes how to use the web interface to review and edit\nvalues provided by a ",(0,r.jsx)(t.em,{children:"processor"})," (see Terminology, below) for a set\nof documents. It is assumed that the document processing has\nalready occurred, and the combination of scanned images and extracted\ndata have been uploaded into OGRRE -- all these steps are not\npart of the OGRRE tool itself, and are currently performed by the\nCATALOG team (see ",(0,r.jsx)(t.a,{href:"/orphaned-wells-ui/docs/intro",children:"Introduction"}),")."]})}),"\n",(0,r.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,r.jsx)(t.p,{children:"Below is a summary of the basic workflow for using OGRRE."}),"\n",(0,r.jsx)(t.mermaid,{value:"graph LR;\nS1[Login];\nS2[Choose Project];\nS3_1[Choose record];\nS3_2[Review/edit record];\nS5[Export records];\nS4[Exit / Sign out];\n\nS1 --\x3e S2 --\x3e S3_1 --\x3e S4;\nS3_1 --\x3e S3_2 --\x3e S4;\nS3_2 --\x3e S3_1;\nS2 --\x3e S5;\nS5 --\x3e S4;"}),"\n",(0,r.jsx)(t.h2,{id:"terminology",children:"Terminology"}),"\n",(0,r.jsx)(t.p,{children:"Below are the terms used in the tool and throughout this guide."}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Term"}),(0,r.jsx)(t.th,{children:"Definition"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Project"}),(0,r.jsx)(t.td,{children:"Shared workspace for working on records"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Document Type"}),(0,r.jsx)(t.td,{children:'Grouping of similar documents, e.g., "well completion report"'})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Digitize"}),(0,r.jsx)(t.td,{children:"Intelligently convert an image to corresponding text values"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Processor"}),(0,r.jsx)(t.td,{children:"External tool that reads digitizes the supported types of scanned document images"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Record"}),(0,r.jsx)(t.td,{children:"An uploaded document digitized by the processor"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Attribute"}),(0,r.jsx)(t.td,{children:"One digitized name and value from the document"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Confidence"}),(0,r.jsx)(t.td,{children:"The degree of certainty the tool (or human, if set manually) has in the predicted digitized attribute values"})]})]})]}),"\n",(0,r.jsx)(t.h2,{id:"login",children:"Login"}),"\n",(0,r.jsx)(t.p,{children:"Navigate to the URL of the OGRRE deployment you are using, then\nlogin using your Google credentials.\nYou will need to have been added by an administrator as a valid user of this deployed instance."}),"\n",(0,r.jsx)(t.h2,{id:"choose-a-project",children:"Choose a project"}),"\n",(0,r.jsx)(t.p,{children:"Records are organized into projects.\nStart by selecting the project in the list."}),"\n",(0,r.jsx)(h,{}),"\n",(0,r.jsxs)(t.p,{children:["This will open the ",(0,r.jsx)(t.strong,{children:"project view"}),", showing all the records in the project."]}),"\n",(0,r.jsx)(j,{}),"\n",(0,r.jsx)(t.p,{children:"The meaning of the columns in this view are as follows:"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Column"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Record Name"}),(0,r.jsx)(t.td,{children:"Name of file uploaded"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Date Uploaded"}),(0,r.jsx)(t.td,{children:"When the file was uploaded"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"API Number"}),(0,r.jsx)(t.td,{children:"Well API Number available from the uploaded file"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Confidence"}),(0,r.jsx)(t.td,{children:"For each attribute digitized, the associated confidence % given by processor"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Mean Confidence"}),(0,r.jsx)(t.td,{children:"Mean of all digitized attributes\u2019 confidence values in that record"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Lowest Confidence"}),(0,r.jsx)(t.td,{children:"Lowest of all the confidence values in the record"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Notes"}),(0,r.jsx)(t.td,{children:"Notes added to the record"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Digitization Status"}),(0,r.jsx)(t.td,{children:"Status of record in tool: uploading/ processing/ digitized"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Review Status"}),(0,r.jsx)(t.td,{children:"Status of review for the record: unreviewed/ reviewed"})]})]})]}),"\n",(0,r.jsx)(t.h2,{id:"choose-a-record",children:"Choose a record"}),"\n",(0,r.jsxs)(t.p,{children:["Selecting a record from the project (row in the table) to review will open the ",(0,r.jsx)(t.strong,{children:"record details view"}),",\nwhich allows review and editing of a single record."]}),"\n",(0,r.jsx)(t.h2,{id:"reviewedit-record",children:"Review/edit record"}),"\n",(0,r.jsx)(t.p,{children:"Below is an example digitized record on the record details view page."}),"\n",(0,r.jsx)(x,{}),"\n",(0,r.jsx)(t.h3,{id:"layout",children:"Layout"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"The digitized values are on the left scrollable section and the uploaded document is on the right."}),"\n",(0,r.jsx)(t.li,{children:"The two sides are linked: selecting attributes on the left will highlight the place where it came from in the document on the right"}),"\n"]}),"\n",(0,r.jsx)(t.h3,{id:"contents",children:"Contents"}),"\n",(0,r.jsx)(t.p,{children:"The meaning of the columns in the table on the left-hand side are as follows:"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Column"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Attribute"}),(0,r.jsx)(t.td,{children:"Name of the attribute in the database (and exported data)"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Value"}),(0,r.jsx)(t.td,{children:"Digitized value detected for this attribute"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Confidence"}),(0,r.jsx)(t.td,{children:"Confidence assigned by the processor. Some attributes with values may have low confidence. Values not found will have 0 confidence."})]})]})]}),"\n",(0,r.jsx)(t.h3,{id:"actions",children:"Actions"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Selecting a row in the table will highlight that attribute value in the image on the right panel."}),"\n",(0,r.jsx)(t.li,{children:"Clicking on a value will let you edit the value."}),"\n",(0,r.jsx)(t.li,{children:"You can edit and correct any wrong values detected by processor, or add values for attributes not detected."}),"\n",(0,r.jsx)(t.li,{children:"Complex tabular attributes are collapsed by default, and expand on clicking the row"}),"\n",(0,r.jsx)(t.li,{children:"For each record, you could add notes by clicking \u2018Notes\u2019 button in the toolbar at the bottom and saving them. You could revisit the notes by clicking on same button again for the record. These notes are also accessible from Records list view."}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Keyboard shortcuts:"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Windows Key"}),(0,r.jsx)(t.th,{children:"Mac Key"}),(0,r.jsx)(t.th,{children:"Action"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Up arrow"}),(0,r.jsx)(t.td,{children:"Up arrow"}),(0,r.jsx)(t.td,{children:"Previous row in table"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Down arrow"}),(0,r.jsx)(t.td,{children:"Down arrow"}),(0,r.jsx)(t.td,{children:"Next row in table"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Enter"}),(0,r.jsx)(t.td,{children:"Enter"}),(0,r.jsx)(t.td,{children:"Edit the value of highlighted attribute, or while editing to save"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Esc"}),(0,r.jsx)(t.td,{children:"Esc"}),(0,r.jsx)(t.td,{children:"While editing, do not save the edited value"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Ctrl + Shift + Right arrow"}),(0,r.jsx)(t.td,{children:"Cmd + Shift + Right arrow"}),(0,r.jsx)(t.td,{children:"Mark as reviewed & Go to next record"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Ctrl + Left arrow"}),(0,r.jsx)(t.td,{children:"Cmd + Left arrow"}),(0,r.jsx)(t.td,{children:"Go to previous record"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"Ctrl + Right arrow"}),(0,r.jsx)(t.td,{children:"Cmd + Right arrow"}),(0,r.jsx)(t.td,{children:"Go to next record"})]})]})]}),"\n",(0,r.jsx)(t.h3,{id:"review-status",children:"Review status"}),"\n",(0,r.jsx)(t.p,{children:"A record can be in one of the following review statuses:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"Unreviewed"}),"\n",(0,r.jsx)(t.li,{children:"Incomplete"}),"\n",(0,r.jsx)(t.li,{children:"Reviewed"}),"\n",(0,r.jsx)(t.li,{children:"Defective"}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"export-records",children:"Export records"}),"\n",(0,r.jsxs)(t.p,{children:["You can export all the record data in a project with the ",(0,r.jsx)(t.code,{children:"Export Project"})," button\non the ",(0,r.jsx)(t.strong,{children:"project view"})," page."]}),"\n",(0,r.jsx)(a,{}),"\n",(0,r.jsx)(t.p,{children:"You can select attributes to include in the exported data."}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(t.em,{children:"CSV"})," option will export the values from each record as a comma-separated values table, whereas\nthe ",(0,r.jsx)(t.em,{children:"JSON"})," option will export the values along with additional metadata about confidence\nas a JSON (JavaScript Object Notation) object. Either of these formats can be read easily\nusing Python, and of course CSV is easily imported in Excel, Google Sheets, etc."]}),"\n",(0,r.jsx)(t.h2,{id:"exit--sign-out",children:"Exit / Sign out"}),"\n",(0,r.jsx)(t.p,{children:"To logout you can close the window. Since the program uses Google credentials, if you\nsign out of your Google account you will need to login again on the next visit."})]})}function m(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(w,{...e})}):w(e)}}}]);