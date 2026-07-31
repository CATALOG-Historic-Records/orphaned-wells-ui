---
title: 'OGRRE: A Web-Based Platform for Digitizing Oil and Gas Regulatory Records'
authors:
  - name: Greg Lackey
    affiliation: '1'
  - name: Benjamin Houghton
    affiliation: '1'
  - name: Jacob Shay
    affiliation: '1'
  - name: Dan Gunter
    affiliation: '2'
  - name: Michael Pesce
    affiliation: '2'
  - name: Rajshree Deshmukh
    affiliation: '2'
  - name: Chester J. Weiss
    affiliation: '3'
  - name: David Buttler
    affiliation: '4'
  - name: Martin Ma
    affiliation: '5'
affiliations:
  - index: 1
    name: National Energy Technology Laboratory, United States
  - index: 2
    name: Lawrence Berkeley National Laboratory, United States
  - index: 3
    name: Sandia National Laboratories, United States
  - index: 4
    name: Lawrence Livermore National Laboratory, United States
  - index: 5
    name: Los Alamos National Laboratory, United States
date: 30 July 2026
---

# Summary

The Oil and Gas Regulatory Record Digitizer (OGRRE) is an open-source, web-based platform for turning scanned oil and gas records into structured, reviewable data. OGRRE connects document-processing models with a graphical interface in which users can upload records, inspect extracted values alongside the source document, correct errors, record review status and notes, and export the resulting data as CSV or JSON. The platform is intended for researchers, regulators, and other teams who need to assemble reliable information from historical well records that are difficult to search or are not represented in modern databases.

OGRRE is designed for collections in which the input may contain multiple documents, document layouts may vary, and the information of interest may appear in tables or other complex arrangements. Its documented workflow uses document splitting, classification, and extraction processors. In the current deployment, these processors are provided by Google Document AI, while OGRRE supplies the project, record, schema, review, and export workflows around them. The source code, deployment configuration, and user documentation are available from the [project repository](https://github.com/CATALOG-Historic-Records/orphaned-wells-ui).

# Statement of need

Historical well records contain information needed for well identification, plugging and reclamation planning, environmental assessment, and studies of historic oil and gas operations. Much of this information is stored in scanned documents, and records differ substantially in format, terminology, completeness, and organization. As a result, a research group may need to inspect and transcribe large collections before it can perform even basic analysis. The United States Geological Survey's documented orphaned-well dataset illustrates both the importance of this work and the scale of the underlying data problem: its 2022 analysis reported 117,672 documented, unplugged orphaned oil and gas wells across 27 states (Grove and Merrill, 2022).

OGRRE addresses the gap between automated document processing and research-ready data. Automatic extraction can accelerate digitization, but extracted values still require context-sensitive review. OGRRE therefore treats the scanned document and its extracted attributes as a linked pair. Reviewers can select an attribute and see its location in the source image, edit or add values, assign review status, and retain notes. This supports a transparent workflow in which machine-generated results are checked by people rather than silently accepted.

The target users are teams working with historical regulatory, geological, or engineering records, especially teams building datasets about lost, abandoned, or orphaned oil and gas wells. OGRRE was developed within the Department of Energy's Consortium Advancing Technology for Assessment of Lost Oil & Gas Wells (CATALOG), a collaboration involving Lawrence Berkeley, Los Alamos, Sandia, and Lawrence Livermore National Laboratories together with the National Energy Technology Laboratory. The software is consequently focused on a practical research need: making heterogeneous historical records usable for downstream scientific and public-interest analysis.

# State of the field

Existing document-processing systems provide OCR, document classification, and information extraction, while database and spreadsheet tools provide ways to store and inspect the resulting values. These components are useful independently, but they do not by themselves provide a domain-oriented workflow for managing projects of records, associating processor schemas with document types, reviewing model confidence, editing extracted values against source images, and exporting curated records. OGRRE's contribution is the integration of these activities into one reproducible application.

OGRRE does not replace general-purpose OCR or machine-learning systems. Instead, it builds a research workflow around them and allows processor models to be configured for the document categories encountered by a project. This build-versus-contribute choice is important because the problem is not simply text recognition: it is the maintenance of provenance and human quality control across a large collection of variable historical documents. A general-purpose OCR viewer, a spreadsheet, or a document-AI console can support parts of the process, but each leaves substantial project management and review work to be implemented separately.

# Software design

OGRRE is implemented as a React and TypeScript frontend. The frontend communicates with a separate Python/FastAPI server, backed by a MongoDB database. The interface, API, and persistence layers can be deployed independently. The repository includes Docker Compose configuration for running the frontend, backend, and database together during development, as well as deployment configurations for Google Cloud. This architecture reflects a balance between accessibility for users and operational requirements for teams processing documents at scale.

The central data model organizes records into projects and record groups and associates each record with its source document, extracted attributes, confidence values, and review state. Processor definitions and schemas are managed through the interface, so a project can represent the fields expected for a particular document type without changing the application code. Users can upload individual files or directories, optionally run configured cleaning functions, and export selected fields as CSV or JSON. JSON export retains additional metadata such as confidence values, while CSV supports common analysis and spreadsheet workflows.

The document-processing workflow is broken into a four-stage workflow, with the first three stages performed by Python scripts and interaction with the AI processing tools (currently, Google DocAI). A _splitter_  identifies document boundaries in collated PDFs; a _classifier_ assigns documents to categories; and an _extractor_ finds, and extract values for, fields for each category. The resulting values are stored in the OGRRE database for review by the OGRRE UI. Separating these stages provides flexibility and aligns with the workflow expected by both the current Google DocAI and future open-source AI document processing workflows. Finally, the OGRRE UI _reviews_ the documents and can export results in standard formats such as comma-separated values. The review team, which is typically a company or state agency, doesn't have to know the details of the AI processing.

The OGRRE UI emphasizes review efficiency. Attribute values and the source document are displayed together, selections are linked to image regions, low-confidence values can be prioritized, and keyboard shortcuts support movement through records. Review statuses including unreviewed, incomplete, reviewed, and defective make the state of a dataset visible to collaborators. These choices favor traceability and collaborative correction over a fully automated but opaque pipeline.

![alt text](image.png)
Figure 1: OGRRE UI. This screen shows review of a document. The fields on the left show extracted values, which can be edited by a person and saved to the database. As fields are selected on the left, the corresponding bounding box detected by the AI processing will be highlighted in the image on the right. Buttons at the bottom of the page and numerous keyboard shortcuts allow for navigation through a list of documents.

# Research impact statement

OGRRE is being used in collaboration with the joint Lawrence Berkeley National Laboratory and National Energy Technology Laboratory team, and the repository provides deployment configurations for multiple collaborator-specific instances. Its documentation includes a complete workflow for configuring processors, uploading and reviewing records, updating schemas, and exporting data, as well as a Docker-based development stack and Google Cloud deployment guidance. These materials provide a basis for reproducible adoption by research teams with comparable document-digitization needs.

The immediate research value of OGRRE is its ability to provide reliable data for orphaned well locations and characteristics which can augment field studies and other document sources. In studies of orphaned and undocumented wells, the platform can help connect information extracted from historical records with later analyses of well locations, construction, production history, and remediation priorities. The project materials supplied for this draft do not identify a peer-reviewed publication that directly reports results produced with OGRRE; the authors should add representative datasets, deployments, benchmarks, and publications here before submission if they are available. Such evidence would allow the paper to quantify throughput, extraction accuracy, review effort, or reuse by external groups.

# AI usage disclosure

Generative AI was used to assist with the preparation of this draft paper. The generated text was based on `info.txt`, the OGRRE documentation, the public source repository, and the JOSS paper-format guidance. The content was checked against those materials, and claims not supported by them were either qualified or marked for author verification. No claim in this disclosure implies that generative AI was used to create the OGRRE software itself.

# Acknowledgements

OGRRE was developed as part of the U.S. Department of Energy's Consortium Advancing Technology for Assessment of Lost Oil & Gas Wells (CATALOG). The authors should add the applicable DOE award numbers, laboratory contract numbers, and any other financial support required by the participating institutions before submission.

# References

- Grove, K., and M. D. Merrill. 2022. *Analysis of the United States Documented Unplugged Orphaned Oil and Gas Well Dataset*. U.S. Geological Survey Data Report 1167. [https://pubs.usgs.gov/publication/dr1167/full](https://pubs.usgs.gov/publication/dr1167/full).

- Google Cloud. 2026. *Document AI documentation*. Google Cloud Documentation. [https://cloud.google.com/document-ai/docs](https://cloud.google.com/document-ai/docs).

- Open Journals. 2026. *JOSS paper format*. Journal of Open Source Software documentation. [https://joss.readthedocs.io/en/latest/paper.html](https://joss.readthedocs.io/en/latest/paper.html).

- CATALOG Historic Records. 2026. *orphaned-wells-ui (OGRRE)*. GitHub repository. [https://github.com/CATALOG-Historic-Records/orphaned-wells-ui](https://github.com/CATALOG-Historic-Records/orphaned-wells-ui).
