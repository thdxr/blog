import {
  Code,
  Image,
  Paragraph,
  H2,
  Highlight,
  Post,
  Wide,
  MetadataType,
} from "~/components/post";
export const Metadata: MetadataType = {
  title: "Intel RAID and Arch Linux",
  description: "Getting FakeRaid working in an Arch Linux installation",
  slug: "intel-raid-and-arch-linux",
  date: "2017-09-17",
  minutes: 2,
};

export default function () {
  return (
    <Post metadata={Metadata}>
      <Wide>
        <Image src="https://miro.medium.com/max/1400/1*VMn3IWK95NQ-x3yfmU-HkA.jpeg" />
      </Wide>

      <Paragraph>
        If you’re running into an error when booting your shiny new Arch install
        with the message
        <Highlight color="code">
          {"unabled to find root device 'UUID=<uuid here>'"}
        </Highlight>{" "}
        don’t panic. There’s a simple fix that does not require a fresh install
      </Paragraph>

      <H2>The Problem</H2>
      <Paragraph>
        If you don’t care about what’s going on feel free to skip ahead to the
        solution section. The issue here is that the Intel RAID driver that many
        motherboards ship with is not a real hardware RAID controller. Hardware
        RAID exposes your RAID configuration to your OS as though it was a
        single real volume. This means your OS does not have to be aware of
        anything special going on.
      </Paragraph>

      <Paragraph>
        However, Intel RAID is actually FakeRaid — your OS has to explicitly
        detect and load your configuration. If you installed your OS to a RAID
        volume, this loading needs to happen before your system boots since it
        is the root volume. This is why you are seeing the message unable to
        find root device — the RAID volume is not yet mounted.
      </Paragraph>

      <H2>The Solution</H2>
      <Paragraph>
        The solution here is to make sure your initramfs in the boot directory
        is configured with mdadm_udev which is a utility to manage software RAID
        configurations. To do this, boot up into a terminal using an Arch ISO.
        Once you’re there run through the following commands
      </Paragraph>

      <Paragraph>
        Use <Highlight color="code">lsblk</Highlight> to figure out what device
        your OS is installed on. For me it’s{" "}
        <Highlight color="code">md126p5</Highlight>
      </Paragraph>

      <Code>
        {[
          "$ lsblk",
          "NAME MAJ:MIN RM SIZE RO TYPE MOUNTPOINT",
          "sda 8:0 0 465.8G 0 disk",
          "└─md126 9:126 0 931.5G 0 raid0",
          " ├─md126p1 259:0 0 450M 0 md",
          " ├─md126p2 259:1 0 100M 0 md",
          " ├─md126p3 259:2 0 16M 0 md",
          " ├─md126p4 259:3 0 599.5G 0 md",
          " └─md126p5 259:4 0 331.5G 0 md",
          "sdb 8:16 0 465.8G 0 disk",
          "└─md126 9:126 0 931.5G 0 raid0",
          " ├─md126p1 259:0 0 450M 0 md",
          " ├─md126p2 259:1 0 100M 0 md",
          " ├─md126p3 259:2 0 16M 0 md",
          " ├─md126p4 259:3 0 599.5G 0 md",
          " └─md126p5 259:4 0 331.5G 0 md",
        ].join("\n")}
      </Code>
      <Paragraph>Mount that drive to a directory</Paragraph>
      <Code>$ mount /dev/md126p5 /mnt/</Code>
      <Paragraph>
        Next, use arch-chroot to simulate as though you were booting up into
        that drive.
      </Paragraph>
      <Code>$ arch-chroot /mnt</Code>
      <Paragraph>
        Use <Highlight color="code">lsblk</Highlight>again to find your boot
        directory (it’s usually around 100mb and a FAT formatted) and mount it.
        Mine is at <Highlight color="code">md126p2</Highlight>
      </Paragraph>
      <Code>$ mount /dev/md126p2 /boot</Code>
      <Paragraph>
        That’s enough preparing, time for the real fix. Open up your
        mkinitcpio.conf for editing
      </Paragraph>
      <Code>$ vi /etc/mkinitcpio.conf</Code>

      <Paragraph>
        Edit the <Highlight color="code">HOOKS</Highlight> line to include
        <Highlight color="code">mdadm_udev</Highlight> right before the
        filesystems entry. Mine looks like this
      </Paragraph>

      <Code>
        HOOKS="base udev autodetect modconf block keyboard keymap mdadm_udev
        filesystems fsck"
      </Code>

      <Paragraph>
        Almost done! Save and exit the file and generate a new{" "}
        <Highlight color="code">initramfs</Highlight> using{" "}
        <Highlight color="code">mkinitcpio</Highlight>
      </Paragraph>

      <Code>$ mkinitcpio -p linux</Code>

      <Paragraph>
        All done! Reboot your machine and your RAID volume should be loaded
        properly and everything should work
      </Paragraph>
    </Post>
  );
}
