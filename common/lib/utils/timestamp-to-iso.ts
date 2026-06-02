import { Timestamp } from "@mirocinema/contracts/gen/ts/google/protobuf/timestamp";

export function timestampToISO(ts: Timestamp): string | null {
    return new Date(ts.seconds * 1000 + ts.nanos / 1_000_000).toISOString()
}