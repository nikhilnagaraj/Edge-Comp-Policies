
export type CheckObject = {
    icon: string;
    prompt: string;
    title: string;
}

export const PROMPTS = {
    areaEfficiency: `State the usable floor area (UFA) and the lettable floor area (LFA) from the project brief provided below. If not mentioned, please state the same. 
Does this meet the design efficiency requirements for floor area as stated in the policies?`,
    buildingHeight: `Does the project brief provided below have dimensions for the floor height?
If not, please state that they are not available in the brief.
If they are available, do they meet the policies' requirements?
Please state the differences in floor height.
`,
    thermalInsulation: `Does the projet brief provided below meet the Thermal Insulation requirements stated in the policies?
Please give an overview per category.
Please state if a category is not available in the provided document or if there are categories in the provided document that are not in the policies.
`,
    thermalComfort: `Does the provided project brief meet the General Thermal Comfort requirements as stated in the policies.
Please give an overview per category for Winter and Summer.
Please state if the value is higher or lower than the policies.
Please state if a category is not available in the provided document or if there are categories in the provided document that are not in the policies
`,
    certifications: `Does the provided project brief meet the building certifications stated in the policies.
Please state if the building certifications are met or if they are missing.
`,
    occupancy: `Does the provided project brief below meet the occupancy as stated in the Edge company policies?
Please divide into:
Office space
Entrance space
Bike parking
Car parking
Atrium
Staircase
Elevator
Does the occupancy meet the building conducts / laws?
Please give an overview of all the areas mentioned in the provided brief and whether we have guidelines in our policies.
`
}

export const CHECKS: CheckObject[] = [
    {
        icon: "AreaChart",
        prompt: PROMPTS.areaEfficiency,
        title: "Area Efficiency"
    },
    {
        icon: "BuildDefinition",
        prompt: PROMPTS.buildingHeight,
        title: "Building Height"
    },
    {
        icon: "BlowingSnow",
        prompt: PROMPTS.thermalComfort,
        title: "Thermal Insulation"
    },
    {
        icon: "LightningBolt",
        prompt: PROMPTS.thermalInsulation,
        title: "Thermal Comfort"
    },
    {
        icon: "Medal",
        prompt: PROMPTS.certifications,
        title: "Certifications"
    },
    {
        icon: "People",
        prompt: PROMPTS.occupancy,
        title: "Occupancy"
    }
]