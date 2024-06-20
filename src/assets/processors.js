export const processor_data = 
{
    colorado:
    [
        {
            id: "b61bb82a239330",
            processor_id: "b61bb82a239330",
            name: "ColoradoDrillingReportExtractor",
            displayName: "Colorado Drilling Report Extractor",
            state: "CO",
            img: "./img/CO-well-completion-report.png",
            attributes: [
                {
                    name: "API_NUMBER",
                    data_type: "number",
                    occurrence: "required_once",
                },
                {
                    name: "AS_DRILLED_LATITUDE",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "AS_DRILLED_LONGITUDE",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "CASING_LINER_AND_CEMENT",
                    data_type: "list",
                    occurrence: "optional_once",
                    subattributes: [
                        {
                            name: "CASING_LINER_SIZE",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "CASING_LINER_TOP",
                            data_type: "plain_text",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "CASING_LINER_WT",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "CASING_TOOL_SETTING_DEPTH",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "CEMENT_BOTTOM",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "CEMENT_TOP",
                            data_type: "plain_text",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "HOLE_SIZE",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "IDENTIFY_METHOD_CALC",
                            data_type: "checkbox",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "IDENTIFY_METHOD_CBL",
                            data_type: "checkbox",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "NUMBER_OF_SACKS_CEMENT",
                            data_type: "number",
                            occurrence: "optional_multiple",
                        },
                        {
                            name: "STRING",
                            data_type: "plain_text",
                            occurrence: "optional_multiple",
                        },
                    ]
                },
                {
                    name: "DATE_COMPLETED_OR_DA",
                    data_type: "datetime",
                    occurrence: "required_once",
                },
                {
                    name: "DATE_TD_REACHED",
                    data_type: "datetime",
                    occurrence: "required_once",
                },
                {
                    name: "ELEVATIONS_GR",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "ELEVATIONS_KB",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "FIELD_NAME",
                    data_type: "plain_text",
                    occurrence: "required_once",
                },
                {
                    name: "FIELD_NUMBER",
                    data_type: "plain_text",
                    occurrence: "required_once",
                },
                {
                    name: "NAME_OF_OPERATOR",
                    data_type: "plain_text",
                    occurrence: "required_once",
                },
                {
                    name: "PLUG_BACK_TOTAL_DEPTH_MD",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "PLUG_BACK_TOTAL_DEPTH_TVD",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "SPUD_DATE",
                    data_type: "datetime",
                    occurrence: "required_once",
                },
                {
                    name: "TOTAL_DEPTH_MD",
                    data_type: "number",
                    occurrence: "optional_once",
                },
                {
                    name: "TOTAL_DEPTH_TVD",
                    data_type: "number",
                    occurrence: "optional_once",
                },
            
                {
                    name: "WELL_CLASSIFICATION_COALBED",
                    data_type: "checkbox",
                    occurrence: "optional_once",
                },
                // {
                //     name: "WELL_CLASSIFICATION_DRY",
                //     data_type: "checkbox",
                //     occurrence: "optional_once",
                // },
                {
                    name: "WELL_CLASSIFICATION_GAS",
                    data_type: "checkbox",
                    occurrence: "optional_once",
                },
                {
                    name: "WELL_CLASSIFICATION_OIL",
                    data_type: "checkbox",
                    occurrence: "optional_once",
                },
                {
                    name: "WELL_NAME",
                    data_type: "plain_text",
                    occurrence: "required_once",
                },
                {
                    name: "WELL_NUMBER",
                    data_type: "plain_text",
                    occurrence: "required_once",
                },
            ],
            documentType: "Well Completion Report",
        },
    ],

    illinois: [
        {
            id: "fa0d15e4e6966543",
            processor_id: "fa0d15e4e6966543",
            name: "IllinoisWellCompletion",
            displayName: "Illinois Well Completion",
            state: "IL",
            img: "./img/CO-well-completion-report.png",
            attributes: [
                {name: "ACIDIZED", data_type: "checkbox", occurrence: "optional_once"},
                {name: "ACIDIZED_LIST_AMOUNT_USED", data_type: "plain_text", occurrence: "optional_once"},
                {name: "CABLE_TOOLS_FROM", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "CABLE_TOOLS_TO", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "Class_II_Injection_Well", data_type: "checkbox", occurrence: "optional_once"},
                {
                    name: "Completion_for_Production", 
                    data_type: "list", 
                    occurrence: "optional_multiple",
                    subattributes: [
                        // {name: "Acidized_Fractures_Other", data_type: "plain_text", occurrence: "optional_multiple"},
                        {name: "Formation_Name", data_type: "plain_text", occurrence: "optional_multiple"},
                        // {name: "Lithology", data_type: "plain_text", occurrence: "optional_multiple"},
                        // {name: "Open_Hole_Interval", data_type: "plain_text", occurrence: "optional_multiple"},
                        {name: "Perforation_Interval", data_type: "plain_text", occurrence: "optional_multiple"},
                        // {name: "Shots", data_type: "plain_text", occurrence: "optional_multiple"},
                    ]
                },
                // {name: "Conversion", data_type: "checkbox", occurrence: "optional_once"},
                {name: "COUNTY", data_type: "plain_text", occurrence: "required_once"},
                {name: "DAILY_PRODUCTION_BBLS_GAS_MCF", data_type: "number", occurrence: "optional_once"},
                {name: "DAILY_PRODUCTION_BBLS_OIL", data_type: "number", occurrence: "optional_once"},
                {name: "DAILY_PRODUCTION_BBLS_WATER", data_type: "number", occurrence: "optional_once"},
                {name: "DATE_DRILLING_BEGAN", data_type: "datetime", occurrence: "optional_once"},
                {name: "DATE_DRILLING_COMPLETED", data_type: "datetime", occurrence: "optional_once"},
                // {name: "Date_First_Injection", data_type: "datetime", occurrence: "optional_once"},
                {name: "DATE_ISSUED", data_type: "datetime", occurrence: "required_once"},
                {name: "DATE_OF_FIRST_PROD", data_type: "datetime", occurrence: "optional_once"},
                {name: "DATE_OF_TEST", data_type: "datetime", occurrence: "optional_once"},
                {name: "DATE_SIGNED", data_type: "datetime", occurrence: "optional_once"},
                // {name: "DEEPENED", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Drill_and_Abandon", data_type: "checkbox", occurrence: "optional_once"},
                {name: "DRILL_STEM_TEST_RUN_NO", data_type: "checkbox", occurrence: "optional_once"},
                {name: "DRILL_STEM_TEST_RUN_YES", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Drill_Stem_Zone_Tested", data_type: "plain_text", occurrence: "optional_multiple"},
                // {name: "DRILLED_OUT_PLUGGED_HOLE", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Dry_Hole", data_type: "checkbox", occurrence: "optional_once"},
                {name: "ELECTRIC_OR_OTHER_LOGS_RUN_DATE", data_type: "datetime", occurrence: "optional_once"},
                // {name: "ELECTRIC_OR_OTHER_LOGS_RUN_NO", data_type: "checkbox", occurrence: "optional_once"},
                {name: "ELECTRIC_OR_OTHER_LOGS_RUN_YES", data_type: "checkbox", occurrence: "optional_once"},
                {name: "ELEVATION_DF", data_type: "number", occurrence: "optional_once"},
                {name: "ELEVATION_KB", data_type: "number", occurrence: "optional_once"},
                // {name: "FRACTURED", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "FRACTURED_LIST_AMOUNT_USED", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "Gas", data_type: "checkbox", occurrence: "optional_once"},
                {name: "GAS_INPUT", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Gas_Storage", data_type: "checkbox", occurrence: "optional_once"},
                {name: "GROUND", data_type: "number", occurrence: "optional_once"},
                {name: "HOLE_SIZE", data_type: "number", occurrence: "optional_once"},
                {name: "INTERVALS", data_type: "plain_text", occurrence: "optional_once"},
                {name: "LEASE_SIGN_POSTED_NO", data_type: "checkbox", occurrence: "optional_once"},
                {name: "LEASE_SIGN_POSTED_YES", data_type: "checkbox", occurrence: "optional_once"},
                {name: "LENGTH_OF_TEST", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "LINER_CSG_PULLED", data_type: "number", occurrence: "optional_once"},
                // {name: "LINER_DEPTH", data_type: "number", occurrence: "optional_once"},
                // {name: "Liner_Hole_Size", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "LINER_SIZE", data_type: "number", occurrence: "optional_once"},
                // {name: "LINER_SKS_CEMENT", data_type: "number", occurrence: "optional_once"},
                // {name: "Liner_Top_Determined_By", data_type: "plain_text", occurrence: "optional_multiple"},
                // {name: "Liner_Top_of_Cement", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "LOCATION", data_type: "plain_text", occurrence: "optional_once"},
                {name: "MINE_INTERMEDIATE_CSG_PULLED", data_type: "plain_text", occurrence: "optional_once"},
                {name: "MINE_INTERMEDIATE_DEPTH", data_type: "number", occurrence: "optional_once"},
                {name: "Mine_Intermediate_Hole_Size", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "MINE_INTERMEDIATE_SIZE", data_type: "number", occurrence: "optional_once"},
                {name: "MINE_INTERMEDIATE_SKS_CEMENT", data_type: "number", occurrence: "optional_once"},
                {name: "Mine_Intermediate_Top_Determined_By", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Mine_Intermediate_Top_Of_Cement", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "NAME_OF_PRODUCING_INJECTION_FORMATION", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "NEW_WELL", data_type: "checkbox", occurrence: "optional_once"},
                {name: "OBSERVATION", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "OIL", data_type: "checkbox", occurrence: "optional_once"},
                {name: "OPERATOR", data_type: "plain_text", occurrence: "required_once"},
                // {name: "OTHER", data_type: "checkbox", occurrence: "optional_once"},
                {name: "OTHER_LIST_AMOUNT_USED", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "Packer_Brand_and_Type", data_type: "plain_text", occurrence: "optional_multiple"},
                // {name: "Packer_Setting_Depth", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "PBTD", data_type: "number", occurrence: "optional_once"},
                {name: "PERFORATED", data_type: "checkbox", occurrence: "optional_once"},
                {name: "PERFORATED_LIST_AMOUNT_USED", data_type: "plain_text", occurrence: "optional_once"},
                {name: "PERMIT_NO", data_type: "number", occurrence: "required_once"},
                // {name: "Premittee_Number", data_type: "plain_text", occurrence: "optional_once"},
                {name: "PRODUCING_CSG_PULLED", data_type: "plain_text", occurrence: "optional_once"},
                {name: "PRODUCING_DEPTH", data_type: "number", occurrence: "optional_once"},
                {name: "PRODUCING_SIZE", data_type: "number", occurrence: "optional_once"},
                {name: "PRODUCING_SKS_CEMENT", data_type: "number", occurrence: "optional_once"},
                // {name: "Production_Formation", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Production_Hole_Size", data_type: "plain_text", occurrence: "optional_once"},
                {name: "Production_Top_Determined_By", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Production_Top_of_Cement", data_type: "plain_text", occurrence: "optional_once"},
                {name: "RANGE", data_type: "plain_text", occurrence: "optional_once"},
                {name: "Reference_Number", data_type: "plain_text", occurrence: "optional_once"},
                {name: "ROTARY_TOOLS_FROM", data_type: "plain_text", occurrence: "optional_once"},
                {name: "ROTARY_TOOLS_TO", data_type: "plain_text", occurrence: "optional_once"},
                {name: "SECTION", data_type: "number", occurrence: "optional_once"},
                // {name: "Service_Well", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Service_Well_Text", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "SHOT", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "SHOT_LIST_AMOUNT_USED", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "Source_Injected_Fluid", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "SURFACE_CSG_PULLED", data_type: "plain_text", occurrence: "optional_once"},
                {name: "SURFACE_DEPTH", data_type: "number", occurrence: "optional_once"},
                // {name: "Surface_Formation", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Surface_Hole_Size", data_type: "plain_text", occurrence: "optional_once"},
                {name: "SURFACE_SIZE", data_type: "number", occurrence: "optional_once"},
                {name: "SURFACE_SKS_CEMENT", data_type: "number", occurrence: "optional_once"},
                {name: "Surface_Top_Determined_By", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Surface_Top_of_Cement", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "SWD", data_type: "checkbox", occurrence: "optional_once"},
                {name: "TOTAL_DEPTH", data_type: "number", occurrence: "optional_once"},
                {name: "TOWNSHIP", data_type: "plain_text", occurrence: "optional_once"},
                {name: "Tubing_Size", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "Tubing_Type", data_type: "plain_text", occurrence: "optional_once"},
                // {name: "Type_Injected_Fluid_Other", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Type_Injected_Fluid_Other_Text", data_type: "plain_text", occurrence: "optional_multiple"},
                // {name: "Type_Injected_Fluid_Saltwater", data_type: "checkbox", occurrence: "optional_once"},
                {name: "Type_of_Log", data_type: "plain_text", occurrence: "optional_multiple"},
                {name: "WAS_WELL_CORED_NO", data_type: "checkbox", occurrence: "optional_once"},
                {name: "WAS_WELL_CORED_YES", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "WATER_INPUT", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "WATER_SUPPLY", data_type: "checkbox", occurrence: "optional_once"},
                // {name: "Well_Interval_Cored", data_type: "plain_text", occurrence: "optional_once"},
                {name: "WELL_NAME_AND_NO", data_type: "plain_text", occurrence: "required_once"}
                // {name: "Workover", data_type: "checkbox", occurrence: "optional_once"}
            ],
            documentType: "Well Completion Report generic",
        },
        {
            id: "10aa396edc8a5178",
            processor_id: "10aa396edc8a5178",
            name: "IL_Ver_A_Well_Completion",
            displayName: "Well Completion Version A",
            state: "IL",
            img: "./img/IL_Ver_A_Well_Completion_A.png",
            attributes: [
              {
                "name": "Oil",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Gas",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Dry_Hole",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "SWD",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Water_Input",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Gas_Input",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Conv",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Str_Test",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Water_Supply",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Observation",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Operator",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Well_Name_and_No",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Permit_No",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Issued",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Location",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "County",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Section",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Township",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Range",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_DF",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_KB",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_Ground",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Total_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "PBTD",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Drilling_Began",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Drilling_Complete",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rotary_Tools_From",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rotary_Tools_To",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Cable_Tools_From",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Cable_Tools_To",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Hole_Size",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Electric_Logs_Run_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Electric Logs Run",
                "enabled": "yes"
              },
              {
                "name": "Electric_Logs_Run_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Electric Logs Run",
                "enabled": "yes"
              },
              {
                "name": "Electric_Logs_Date",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "New_Well",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Deepened",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Dilled_Out_Plugged_Hole",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Lease_Sign_Posted_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Lease Sign Posted",
                "enabled": "yes"
              },
              {
                "name": "Lease_Sign_Posted_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Lease Sign Posted",
                "enabled": "yes"
              },
              {
                "name": "Was_Well_Cored_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Was Well Cored",
                "enabled": "yes"
              },
              {
                "name": "Was_Well_Cored_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Was Well Cored",
                "enabled": "yes"
              },
              {
                "name": "Drill_Stem_Test_Run_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Drill Stem Test",
                "enabled": "yes"
              },
              {
                "name": "Drill_Stem_Test_Run_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Drill Stem Test",
                "enabled": "yes"
              },
              {
                "name": "Surface_Size",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Sks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Csg_Pulled",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Mine_or_Intermediate_Size",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Mine_or_Intermediate_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Mine_or_Intermediate_Sks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Mine_or_Intermediate_Csg_Pulled",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Producing_Size",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Producing_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Producing_Sks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Producing_Csg_Pulled",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Liner_Size",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Liner_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Liner_Sks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Liner_Csg_Pulled",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Name_of_Producing_or_Injection_Formation",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_of_First_Prod",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_of_Test",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Length_of_Test",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Daily_Production_Bbls_Oil",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Daily_Production_Bbls_Water",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Daily_Production_Bbls_Gas",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intervals",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Perforated",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Completion Type",
                "enabled": "yes"
              },
              {
                "name": "Perforated_Text",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Shot",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Completion Type",
                "enabled": "yes"
              },
              {
                "name": "Shot_Text",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Acidized",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Completion Type",
                "enabled": "yes"
              },
              {
                "name": "Acidized_Text",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Fractures",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Completion Type",
                "enabled": "yes"
              },
              {
                "name": "Fractures_Text",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Other",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Completion Type",
                "enabled": "yes"
              },
              {
                "name": "Other_Text",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Signature",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Address",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Date_Signed",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              }
            ],
            documentType: "Well Completion Report Type A",
        },
        {
            id: "e60bb28febe63e5e",
            processor_id: "e60bb28febe63e5e",
            name: "IL_Ver_B_Well_Completion",
            displayName: "Well Completion Version B",
            state: "IL",
            img: "./img/IL_Ver_B_Well_Completion_C.png",
            attributes: [
              {
                "name": "New_Well",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Conversion",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "DOPH",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Deepening",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Workover",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Report",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Oil_Producer",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Gas_Producer",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Class_II_Injection_Well",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Water_Supply",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Observation",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Gas_Storage",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_D_And_A",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Other",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Other_Text",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "no"
              },
              {
                "name": "Type_Of_Well_Service_Well",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Service_Well_Text",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "no"
              },
              {
                "name": "Type_Of_Well_Coal_Bed_Gas",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Well_Coal_Mine_Gas",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Well",
                "enabled": "yes"
              },
              {
                "name": "Permittee",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Permittee_Number",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Well_Name",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Permit_Number",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Location",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Reference_Number",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "County",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Section",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Township",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Range",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Well_Not_Drilled_Converted_Permit_Expired",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Permit Expired",
                "enabled": "yes"
              },
              {
                "name": "Well_Not_Converted_Permit_Expired",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Permit Expired",
                "enabled": "yes"
              },
              {
                "name": "Well_Not_Drilled_Permit_Expired",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Permit Expired",
                "enabled": "yes"
              },
              {
                "name": "Date_Drilling_Began",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Drilling_Finished",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_KB",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_DF",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Elevation_GR",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rotary_From",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rotary_To",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Cable_From",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Cable_To",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Total_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "PBTD",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Wireline_Logs_Run_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Wireline Logs Run",
                "enabled": "yes"
              },
              {
                "name": "Wireline_Logs_Run_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Wireline Logs Run",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Log",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Log_Date",
                "data_type": "datetime",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Was_Well_Cored_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Was Well Cored",
                "enabled": "yes"
              },
              {
                "name": "Was_Well_Cored_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Was Well Cored",
                "enabled": "yes"
              },
              {
                "name": "Interval_Cored",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Drill_Stem_Test_Run_Yes",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Drill Stem Test",
                "enabled": "yes"
              },
              {
                "name": "Drill_Stem_Test_Run_No",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Drill Stem Test",
                "enabled": "yes"
              },
              {
                "name": "Zone_Tested",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Setting_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Sacks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Hole_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Top_Of_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Surface_Top_Determined_By",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Setting_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Sacks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Hole_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Top_Of_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Intermedate_Mine_String_Or_Liner_Top_Determined_By",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Setting_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Sacks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Hole_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Top_Of_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Production_Top_Determined_By",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Other_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Other_Setting_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Other_Sacks_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Other_Hole_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Other_Top_Of_Cement",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Other_Top_Determined_By",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Tubing_Type",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Tubing_Size",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Packer_Brand_And_Type",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Packer_Setting_Depth",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production",
                "data_type": "parent",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production::Formation_Name",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production::Lithology",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production::Perforation_Interval",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production::Shots",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Completion_For_Production::Open_Hole_Interval",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Completion_For_Production::Acidized_Fractures_Other",
                "data_type": "plain_text",
                "occurrence": "optional_multiple",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Producing_Formations",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Of_First_Production",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Of_Test",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Length_Of_Test",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Initial_Production_Rate_Oil",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Initial_Production_Rate_Water",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Initial_Production_Rate_Gas",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Injection_Formation",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Injection_Fluid_Freshwater",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Injection Fluid",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Injection_Fluid_Saltwater",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Injection Fluid",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Injection_Fluid_Other",
                "data_type": "checkbox",
                "occurrence": "optional_once",
                "grouping": "Type of Injection Fluid",
                "enabled": "yes"
              },
              {
                "name": "Type_Of_Injection_Fluid_Other_Text",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "Type of Injection Fluid",
                "enabled": "no"
              },
              {
                "name": "Source_Of_Injected_Fluid",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Of_First_Injection",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rate_Per_Day_Water",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Water_PSI",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Rate_Per_Day_Gas",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Gas_PSI",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Signature_Of_Permittee_Or_Designee",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "no"
              },
              {
                "name": "Title",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Address",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "Date_Signed",
                "data_type": "datetime",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              },
              {
                "name": "City_State",
                "data_type": "plain_text",
                "occurrence": "optional_once",
                "grouping": "",
                "enabled": "yes"
              }
            ],
            documentType: "Well Completion Report Types B, C, D, E",
        }
    ],
}

			
