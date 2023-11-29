import {FamilyAllowanceStatus} from "../../../models";
import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {noopChangeHandler} from "./noop.change-handler";
import {needsInfoChangeHandler} from "./needs-info.change-handler";
import {reviewedChangeHandler} from "./reviewed.change-handler";
import {pendingBookingsChangeHandler} from "./pending-bookings.change-handler";

export * from './status-change-handler.api'

export const getStatusHandler = (status: FamilyAllowanceStatus): StatusChangeHandlerApi => {
    switch (status) {
        case FamilyAllowanceStatus.NeedsInfo:
            return needsInfoChangeHandler()
        case FamilyAllowanceStatus.Reviewed:
            return reviewedChangeHandler()
        case FamilyAllowanceStatus.PendingBookings:
            return pendingBookingsChangeHandler()
    }

    return noopChangeHandler()
}
