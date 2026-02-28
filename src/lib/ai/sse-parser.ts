export class SSEParser {
  private buffer = "";

  parse(chunk: string): { event?: string; data: string }[] {
    this.buffer += chunk;
    const events: { event?: string; data: string }[] = [];
    const lines = this.buffer.split("\n");

    // Keep the last incomplete line in the buffer
    this.buffer = lines.pop() || "";

    let currentEvent: string | undefined;
    let dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        dataLines.push(line.slice(6));
      } else if (line.trim() === "") {
        // Empty line = end of event
        if (dataLines.length > 0) {
          events.push({ event: currentEvent, data: dataLines.join("\n") });
          dataLines = [];
          currentEvent = undefined;
        }
      }
    }

    // If we have accumulated data lines without a terminating empty line,
    // push them back into the buffer for the next chunk
    if (dataLines.length > 0) {
      const reassembled: string[] = [];
      if (currentEvent) reassembled.push(`event: ${currentEvent}`);
      for (const d of dataLines) reassembled.push(`data: ${d}`);
      this.buffer = reassembled.join("\n") + "\n" + this.buffer;
    }

    return events;
  }
}
