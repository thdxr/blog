import {
  Paragraph,
  Highlight,
  Link,
  Indent,
  H3,
  H2,
  Post,
  MetadataType,
  Strong,
  Wide,
  Image,
  Code,
  Quote,
} from "~/components/post";

export const Metadata: MetadataType = {
  title: "Reading Named Pipes with Elixir",
  description:
    "How to go about reading data from special files like named pipes",
  slug: "reading-named-pipes-elixir",
  minutes: 4,
  date: "2017-08-14",
};

export default function () {
  return (
    <Post metadata={Metadata}>
      <H2>TLDR</H2>
      <Code>
        {"iex(1)> Port.open('myfile', [{:line, 4096}, :eof])"}
        <br />
        {"iex(1)> flush"}
      </Code>
      <Paragraph>
        This works but the answer is actually more complicated than this. Read
        on if you want the full explanation.
      </Paragraph>
      <H2>The Story</H2>
      <Paragraph>
        This past week I was migrating yet another company off of MongoDB. The
        database size was fairly large and I wanted an easy way to stream the
        data out progressively instead of downloading the entire dataset. I
        decided to use mongoexport and pipe the results out to a UNIX named
        pipe.
      </Paragraph>
      <Code>
        mkfifo mongo
        <br />
        mongoexport --db {"<"}db{">"} --collection {"<"}collection{">"} --out
        mongo
      </Code>
      <Paragraph>
        Now I have a special file that I can read line by line and process the
        data. It is totally resumable in case my migration script crashes. Named
        pipes also block the writer unless there is a reader, thereby providing
        back pressure.
      </Paragraph>

      <H2>A Mysterious Error</H2>
      <Paragraph>
        Trying to read this file using File.stream! gave me a mysterious error
      </Paragraph>

      <Code>
        {'iex(1)> File.stream!("mongo") |> Enum.take(10)'}
        <br />
        {
          '** (File.Error) could not stream "mongo": illegal operation on a directory'
        }
      </Code>

      <Paragraph>
        Directory? But I’m trying to open a file. Let’s try simply opening the
        file
      </Paragraph>

      <Code>
        {"iex(1)> File.open('mongo')"}
        <br />
        {"{:error, :eisdir}"}
      </Code>

      <Paragraph>
        Strange, Elixir seems to think this named pipe is a directory. After
        some intense Googling I found that this error is a misnomer, it simply
        indicates that Erlang will not open special files through the standard
        IO api.
      </Paragraph>

      <H2>The Solution</H2>
      <Wide>
        <Image
          title="This is a metaphor"
          src="https://miro.medium.com/max/700/1*wzu63COPRrtMT7TtMIf2pQ.jpeg"
        />
      </Wide>
      <Paragraph>
        The solution is ports! You can open up a named pipe directly as a port.
      </Paragraph>

      <Code>
        {"iex(1)> Port.open('mongo', [{:line, 4096}, :eof])"}
        <br />
        {"#Port<0.1232>"}
        <br />
        {"iex(2)> flush"}
        <br />
        {"{#Port<0.1232>, {:data, {:eol, '<data here>'}}}"}
      </Code>

      <Paragraph>
        Notice the single quotes, we are actually calling the Erlang function
        open_port here which expects an Erlang char list as input. Opening a
        port will immediately start reading the contents of the target and
        delivering them as messages to your current process.
      </Paragraph>

      <Paragraph>
        I also pass in <Highlight color="code">{"{:line, 4096}"}</Highlight> as
        an option which delivers an entire line as a single message with a
        buffer of 4096 bytes. The eof option indicates you would like to receive
        an additional message when the file is closed. You can read about all
        the options here.
      </Paragraph>

      <Paragraph>
        Now you can write a simple receive loop that pulls messages out of the
        mailbox and processes the data. These messages can be piped through
        Stream.async_stream for concurrent processing (yay Elixir). However,
        there’s another problem with this solution.
      </Paragraph>

      <H2>No Backpressure</H2>
      <Paragraph>
        Since I was migrating a large amount of of data the process took a while
        to run. I noticed that memory use was slowly increasing over time. This
        made no sense to me as the whole point of using a named pipe was to
        limit the memory used to only the current entries being processed.
      </Paragraph>

      <Paragraph>
        What I realized after some profiling is that the Port was reading from
        the pipe as fast as possible and loading those messages into the process
        mailbox. The process was not keeping up reading and processing the
        messages so the number of pending messages kept increasing.
      </Paragraph>

      <Paragraph>
        Erlang ports cannot provide back pressure to the pipe since they handle
        delivery of the line as an Erlang message. Unlike Go channels, Erlang
        mailboxes do not block if there is no reader. After some further
        Googling I found that Erlang very intentionally does not support this as
        documented{" "}
        <Link
          href="http://erlang.org/faq/problems.html#idp32909136"
          target="_blank"
        >
          here
        </Link>
      </Paragraph>
      <Quote>
        <Paragraph>
          9.12 Why can’t I open devices (e.g. a serial port) like normal files?
        </Paragraph>
        <Paragraph>
          Short answer: because the erlang runtime system was not designed to do
          that. The Erlang runtime system’s internal file access system, efile,
          must avoid blocking, otherwise the whole Erlang system will block.
          This is not a good thing in a soft real-time system. When accessing
          regular files, it’s generally a reasonable assumption that operations
          will not block. Devices, on the other hand, are quite likely to block.
          Some devices, such as serial ports, may block indefinitely. There are
          several possible ways to solve this. The Erlang runtime system could
          be altered, or an external port program could be used to access the
          device. Two mailing list discussions about the topic can be found{" "}
          <Link
            href="http://erlang.org/pipermail/erlang-questions/2004-January/011353.html"
            target="_blank"
          >
            here
          </Link>{" "}
          and{" "}
          <Link
            target="_blank"
            href="http://erlang.org/pipermail/erlang-questions/2000-March/001050.html"
          >
            here.
          </Link>
        </Paragraph>
      </Quote>

      <H2>A Hack I Cannot Recommend</H2>
      <Paragraph>
        Since Elixir cannot internally provide back pressure, the only option
        was to provide it externally. I decided to use the head utility combined
        with Elixir’s{" "}
        <Link
          target="_blank"
          href="https://hexdocs.pm/elixir/Stream.html#resource/3"
        >
          Stream.resource
        </Link>{" "}
        to create a batched stream.
      </Paragraph>

      <Code>
        {"Stream.resource("}
        <br />
        {"   fn -> 0 end,"}
        <br />
        {"   fn input ->"}
        <br />
        {'    {result, 0} = System.cmd("head", ["-n", "1000", "mongo"])'}
        <br />
        {'    splits = result |> String.split("\\n")'}
        <br />
        {'    IO.puts("Loaded #{@batch * input}")'}
        <br />
        {"    {splits, input + 1}"}
        <br />
        {"   end,"}
        <br />
        {"   fn _ -> end"}
        <br />
        {")"}
        <br />
        {"|> Stream.async_stream(&do_some_work/1, max_concurrency: 1000)"}
      </Code>

      <Paragraph>
        What this does is create a stream of lines in the pipe but only ever
        reads 1000 into memory at a time.
      </Paragraph>

      <Paragraph>
        While this does work, it is clear at this point Elixir isn’t the right
        tool for the job. As much as I love Elixir I was able to rewrite my
        script in Go in about 30 min and had it worked perfectly. Great reminder
        to make sure you have a wide set of options in your toolkit so you can
        use the right one for the job.
      </Paragraph>
    </Post>
  );
}
