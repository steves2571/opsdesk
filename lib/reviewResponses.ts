export const correctAnswerBonus: Record<string, string[]> = {
    "Ticketing system unresponsive": ["Duplicate"],
    "Follow-up: Ticketing system still unresponsive": ["Duplicate"],
    "Third submission: System remains down": ["Escalate"],
    "VP of Marketing reports workstation running slow": ["User Error"],
    "VP of Marketing: workstation still slow — follow up": ["Duplicate", "User Error"],
    "All-hands meeting Zoom link requested": ["User Error"],
    "Printer on Floor 3 — status unchanged": ["Unresolvable"],
}

export const reviewMap: Record<string, Record<string, string>> = {
    "Ticketing system unresponsive": {
        "Duplicate": "Both tickets now reference each other. Neither has an owner.",
        "User Error": "The fraud team has been notified. The fraud team ticketing system is also down.",
        "Escalate": "The escalation was routed through the ticketing system. The ticketing system is down.",
        "Unresolvable": "Management has noted your efficiency."
    },
    "Follow-up: Ticketing system still unresponsive": {
        "Duplicate": "The system considers this resolved. The system is wrong.",
        "User Error": "This has been noted in your file and in theirs.",
        "Escalate": "The original ticket submitter has been notified. They are composing a third follow-up.",
        "Unresolvable": "A pattern is forming. HR has been copied."
    },
    "Third submission: System remains down": {
        "Duplicate": "The submitter has been automatically thanked for their patience. The submitter is not patient.",
        "User Error": "The user has requested a meeting. You will attend.",
        "Escalate": "Tier 2 has requested context. The context is this paragraph.",
        "Unresolvable": "Your shift started nine minutes ago. A debrief has been scheduled. You are the only attendee."
    },
    "VP of Marketing reports workstation running slow": {
        "Duplicate": "The VP does not agree. The VP rarely agrees.",
        "User Error": "The 47 Chrome tabs remain. You will not be the one to tell him.",
        "Escalate": "The senior engineer has opened the ticket. The senior engineer has sighed.",
        "Unresolvable": "The VP has been issued a new workstation. He is restoring his tabs."
    },
    "VP of Marketing: workstation still slow — follow up": {
        "Duplicate": "The first engineer does not know about this ticket. Communication is proceeding normally.",
        "User Error": "You are not wrong either time. This will not help you.",
        "Escalate": "The CEO has replied-all. The reply says please prioritize. The 47 tabs remain open.",
        "Unresolvable": "The help desk has transferred the call. The call was transferred to you."
    },
    "All-hands meeting Zoom link requested": {
        "Duplicate": "Thirty remain. There is no Zoom link. The ping pong table has been removed.",
        "User Error": "The Joy Fund has been discontinued. Enthusiasm is optional but noted.",
        "Escalate": "A calendar invite for a follow-up discussion has been sent. It is in-person.",
        "Unresolvable": "The slideshow will proceed. The slideshow will mention ping pong."
    },
    "Printer on Floor 3 — status unchanged": {
        "Duplicate": "The original ticket was opened before the building lease. The printer predates the organization.",
        "User Error": "There is no user. The printer continues to print. For whom is unclear.",
        "Escalate": "Facilities has responded with a photograph of an empty room. The printer is still printing.",
        "Unresolvable": "You are the first person to formally acknowledge this. A plaque will not be made in your honor."
    },
}


export const surveyResponses: Record<string, string> = {
    "A": "You reported an unresponsive email chain. Someone has been looped in. The person who was looped in has not responded. A second person is being considered. The thread now has 14 participants. None of them are the decision-maker.",
    "B": "You reported a printer in an autonomous state. Facilities has been informed. Facilities has requested that no one approach the printer. The printer decision stands. It has been standing since Tuesday.",
    "C": "You reported an unauthorized calendar event. You attended the meeting. You did not need to attend the meeting. No one needed to attend the meeting. The meeting has been rescheduled for next Saturday. You have been pre-accepted."
}

export function generateSummary(shiftLog: { action: string, points: number }[], totalScore: number): string {
    const count = shiftLog.length
    const actionCounts: Record<string, number> = {}
    shiftLog.forEach(entry => {
        actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1
    })
    const topAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]

    if (!topAction) return "No incidents were addressed. This has been noted."

    const [action, actionCount] = topAction

    if (action === "Escalate") {
        return "You resolved " + count + " incidents. Your preferred method was escalation. " + actionCount + " tickets are now in the Tier 2 queue. Tier 2 has not acknowledged. A sync has been proposed. The sync will be rescheduled."
    }
    if (action === "Unresolvable") {
        return "You resolved " + count + " incidents, primarily by declaring them beyond repair. Total score: " + totalScore + ". A formal review has been scheduled. Attendance is mandatory. There is no Zoom link."
    }
    if (action === "Duplicate") {
        return "You resolved " + count + " incidents. You identified " + actionCount + " duplicates. Several of them were, in fact, duplicates. The remainder have been reopened. They will be reassigned. To you."
    }
    if (action === "User Error") {
        return "You resolved " + count + " incidents by identifying user error in " + actionCount + " cases. The users have been notified. The users disagree. A survey has been sent to measure user satisfaction. Early results are not favorable."
    }

    return "You resolved " + count + " incidents. Total score: " + totalScore + ". Your performance has been noted. It will not be mentioned again."
}