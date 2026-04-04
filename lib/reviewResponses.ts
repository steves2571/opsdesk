export const correctAnswerBonus: Record<string, string[]> = {
    "Ticketing system unresponsive": ["Duplicate"],
    "Follow-up: Ticketing system still unresponsive": ["Duplicate"],
    "Third submission: System remains down": ["Duplicate"],
    "VP of Marketing reports workstation running slow": ["User Error"],
    "VP of Marketing: workstation still slow — follow up": ["User Error"],
    "All-hands meeting Zoom link requested": ["User Error"],
    "Printer on Floor 3 — status unchanged": ["Unresolvable"],
}

export const reviewMap: Record<string, Record<string, string>> = {
    "Ticketing system unresponsive": {
        "Duplicate": "You marked the ticketing system outage as a duplicate. This is technically correct. The duplicate was also not responded to. Both tickets now reference each other. Neither has an owner.",
        "User Error": "You classified a system outage as user error. The user submitted 2,847 requests. You may have a point. The fraud team has been notified. The fraud team ticketing system is also down.",
        "Escalate": "You escalated this ticket. The escalation was routed through the ticketing system. The ticketing system is down. The escalation is pending.",
        "Unresolvable": "You marked a critical system outage as unresolvable during your first five minutes on shift. Management has noted your efficiency."
    },
    "Follow-up: Ticketing system still unresponsive": {
        "Duplicate": "Correct. This is a duplicate. You now have two tickets marked as duplicates of each other. The system considers this resolved. The system is wrong.",
        "User Error": "You marked the follow-up as user error. The user followed up because no one responded. The user was correct to follow up. This has been noted in your file and in theirs.",
        "Escalate": "You escalated the follow-up. This follow-up is now ahead of the original ticket in the queue. The original ticket submitter has been notified. They are composing a third follow-up.",
        "Unresolvable": "You have marked two consecutive critical tickets as unresolvable. A pattern is forming. HR has been copied."
    },
    "Third submission: System remains down": {
        "Duplicate": "You have now marked all three submissions as duplicates. The submitter has been automatically thanked for their patience. The submitter is not patient.",
        "User Error": "You classified the third submission as user error. The user has now been wrong three times, according to you. The user has requested a meeting. You will attend.",
        "Escalate": "This ticket has been escalated. It joins the previous two in the escalation queue. The queue is three tickets long. All three are the same issue. Tier 2 has requested context. The context is this paragraph.",
        "Unresolvable": "Three critical tickets. All unresolvable. Your shift started nine minutes ago. A debrief has been scheduled. You are the only attendee."
    },
    "VP of Marketing reports workstation running slow": {
        "Duplicate": "You marked the VP ticket as a duplicate. The VP has been informed that his issue is not unique. The VP does not agree. The VP rarely agrees.",
        "User Error": "You identified the root cause as user error. This is correct. The 47 Chrome tabs remain. You will not be the one to tell him. No one will be the one to tell him.",
        "Escalate": "You escalated a workstation performance issue caused by 47 Chrome tabs. A senior engineer has been assigned. The senior engineer has opened the ticket. The senior engineer has sighed.",
        "Unresolvable": "You declared the VP workstation unresolvable. The VP has been issued a new workstation. He has opened Chrome. He is restoring his tabs."
    },
    "VP of Marketing: workstation still slow — follow up": {
        "Duplicate": "Correct. This is the same 47 tabs. The first engineer does not know about this ticket. The second engineer does not know about the first engineer. Communication is proceeding normally.",
        "User Error": "You have now identified user error on two consecutive VP tickets. You are not wrong either time. This will not help you.",
        "Escalate": "You escalated the VP follow-up. The CEO has been copied. The CEO has replied-all. The reply says please prioritize. The 47 tabs remain open.",
        "Unresolvable": "Two VP tickets. Both unresolvable. The VP assistant has called the help desk directly. The help desk has transferred the call. The call was transferred to you."
    },
    "All-hands meeting Zoom link requested": {
        "Duplicate": "You marked one of 31 identical Zoom link requests as a duplicate. Thirty remain. There is no Zoom link. There was never going to be a Zoom link. The meeting is in-person. The ping pong table has been removed to make room for additional seating.",
        "User Error": "You classified the request as user error. The user believed a mandatory in-person meeting would have a remote option. The user was incorrect. The Joy Fund has been discontinued. Attendance is mandatory. Enthusiasm is optional but noted.",
        "Escalate": "You escalated a request for a Zoom link that does not exist to someone who cannot create it. The escalation has been acknowledged. A calendar invite for a follow-up discussion has been sent. It is in-person.",
        "Unresolvable": "Correct. There is no Zoom link. There was never a Zoom link. You have resolved this ticket in the only way it could be resolved. The slideshow will proceed. The slideshow will mention ping pong."
    },
    "Printer on Floor 3 — status unchanged": {
        "Duplicate": "You marked the printer as a duplicate. It is. It has always been a duplicate. The original ticket was opened before your start date. The original ticket was opened before the building lease. The printer predates the organization.",
        "User Error": "You classified the printer as user error. There is no user. There has not been a user on Floor 3 since the reorganization. The printer continues to print. For whom is unclear.",
        "Escalate": "You escalated the printer. The escalation has been received by Facilities. Facilities has responded with a photograph of an empty room. The printer is not in the photograph. The printer is still printing.",
        "Unresolvable": "Correct. The printer is unresolvable. The printer has always been unresolvable. You are the first person to formally acknowledge this. A plaque will not be made in your honor. The printer would have printed it. The printer is unavailable."
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