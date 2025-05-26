export interface DummyLecture {
    _id: string;
    // subjectName: string;
    // subjectCode: string;
    plannedTopic: string;
    fromTime: string;
    toTime: string;
    facultyName: string;
    Room?: string; 
    actualTopic?: string; 
    date: string;
    details: string;
    sem: string;
    status: "Submitted" | "Not Submitted" | "Pending";
    name: string;
    code: string;
}

