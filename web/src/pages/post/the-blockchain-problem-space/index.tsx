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
} from "~/components/post";

export const Metadata: MetadataType = {
  title: "The Blockchain Problem Space",
  description: "An engineering breakdown on when to choose blockchain",
  slug: "the-blockchain-problem-space",
  minutes: 10,
  date: "2017-08-13",
};

export default function () {
  return (
    <Post metadata={Metadata}>
      <Paragraph>
        The world is freaking out about blockchain and I have been sucked in.
        From day 1 of my exploration into the space, it has been enormously
        difficult to navigate the intersection of technology, politics, finance
        and the ensuing hype to get a direct answer to my fundamental question
        of “when should I be considering blockchain as a solution?”
      </Paragraph>
      <Paragraph>
        Several months later I finally have been able to get some clarity on how
        to evaluate it purely as a technology — dispassionately detached from
        its goal of being a vehicle for global change and disruption
      </Paragraph>
      <H2>Blockchain as a database</H2>
      <Paragraph>
        Step one is to figure out a framework for analyzing blockchain.
        Fortunately, it falls into a very mature and well studied category:
        backend databases. Very simply, a blockchain is a database — it allows
        you to persistently store data and retrieve it later. Now the question
        is what kind of database is it?
      </Paragraph>
      <Paragraph>
        It’s important to note that there’s no such thing as an innately useful
        or useless database. Every database chooses a different set of
        trade-offs giving it certain properties that may be useful for certain
        problems. If you’ve ever used a database that sucked, it’s likely that
        it was the wrong choice for your application.
      </Paragraph>

      <H2>Well what kind of database is it?</H2>
      <Paragraph>
        As a distributed system, databases are constrained by the CAP Theorem
        and have to choose between certain capabilities. Blockchain falls into
        the “eventually consistent” subcategory of databases that choose to
        sacrifice total consistency of their data. What this means is all the
        nodes in the database aren’t guaranteed to always have the exact same
        and up to date information.
      </Paragraph>

      <Paragraph>
        Typically, this guarantee is sacrificed to support higher throughput for
        heavy workloads and high availability. Eventually consistent databases
        like Cassandra, CouchDB, and Riak are usually found tackling problems of
        scale. By contrast, blockchain does not have the capability to support
        anywhere near the throughput of these traditional databases.
      </Paragraph>

      <Paragraph>
        The other challenge in any eventually consistent database is that the
        following scenario can happen:
      </Paragraph>

      <Indent>
        <Paragraph>
          1. User-A connects to a node in the USA. They write an amazing blog
          post on blockchain.
        </Paragraph>

        <Paragraph>
          2. There is a network disruption between USA and Europe
        </Paragraph>
        <Paragraph>
          3. User-A sends a link to their blog post to their German friend,
          Üser-B who connects to a node in Europe and cannot find the post. The
          update has not yet made it from the USA.
        </Paragraph>
      </Indent>

      <Paragraph>
        The problem that all eventually consistent systems have to deal with
        regardless of whether the disruption was for a second or for several
        hours is how to merge the two out of sync databases once they’re able to
        communicate again.
      </Paragraph>

      <Paragraph>
        In this scenario, conflict resolution is easy. The post from the USA can
        just be inserted in Europe since it never existed there. However, what
        if the two users were collaborating on the same blog post during the
        network disruption? Two versions of the blog post exist until the
        disruption ends and they have to be merged into one.
      </Paragraph>

      <Paragraph>
        Databases like Cassandra for instance simply decide the last modified
        version of the entity is chosen as the current state. While this is not
        ideal since one user can lose their changes, it is an acceptable loss
        since in most domains{" "}
        <Strong>
          it is unlikely that two users in different locations are modifying the
          same entity at the same time
        </Strong>
        . The two databases in Europe and USA can merge their data entity by
        entity, overwriting data only when it happens to have been modified in
        both places.
      </Paragraph>

      <Paragraph>
        Blockchain, however, handles conflict resolution in quite a different
        way. If there is a net-split between Europe and the USA and two versions
        of the database emerge, it simply decides on re-connection to keep the
        entirety of the version that has received more traffic during the
        disruption (aka the longer chain). This means if the USA version wins,
        all of the modifications in the European version, even if there aren’t
        conflicts, are discarded. To reiterate, this means even if most of the
        interactions in Europe were just with other users in Europe and not in
        conflict with the USA version, all of those writes are thrown away
        regardless.
      </Paragraph>
      <Paragraph>
        At this point it seems like blockchain is an inferior database when
        compared to others ones in the category. However, as I mentioned before
        there is no such thing as a useless database. For everything blockchain
        does worse than other databases, it must be getting something in return
        for those trade-offs.
      </Paragraph>

      <H2>Byzantine Fault Tolerance</H2>
      <Paragraph />
      <Wide>
        <Image src="https://miro.medium.com/max/1400/1*KV-tZPdYic1PcShoz_nToA.png" />
      </Wide>

      <Paragraph>
        Typically, when you setup a database cluster you are in control of every
        node that belongs to it. Byzantine Fault Tolerance allows for systems to
        exist where multiple parties (basically anyone) can contribute nodes to
        the cluster. The complexity that arises with this is that there may be
        bad actors who try to corrupt the data with false information. BFT
        systems are able to tolerate bad actors to some degree. If you would
        like a deep dive on BFT the{" "}
        <Link
          target="_blank"
          href="https://en.wikipedia.org/wiki/Byzantine_fault_tolerance"
        >
          Wikipedia entry
        </Link>{" "}
        is actually quite approachable.
      </Paragraph>

      <Paragraph>
        This is the core feature that most blockchain implementations offer. It
        is the only thing that it does better than every other databases and
        should be the <Strong>main reason</Strong> why you choose blockchain for
        your application. If BFT does not create a huge advantage for your
        use-case, it is unlikely blockchain makes sense to consider over a
        traditional database. Decentralization is not free and must be a{" "}
        <Strong>fundamental requirement</Strong> of your product to justify its
        use. If it’s simply a cool twist on an existing concept, the
        non-decentralized version is always going to be better as it does not
        have to deal with the same constraints.
      </Paragraph>

      <Paragraph>
        Now that we’ve narrowed down the advantage of blockchain to this
        singular trait, we can zoom out from an engineering perspective back
        into the real world. Decentralization is incredibly interesting to me
        from a philosophical perspective. A system that’s run by disconnected
        parties all contributing resources toward a common goal is innately
        appealing. No one wants to be at the mercy of large centralized
        entities.
      </Paragraph>

      <Paragraph>
        But that’s just a personal affinity. The question of how BFT objectively
        provides a measurable technological advantage in the industries that
        blockchain is touted to revolutionize remains to be answered. The old,
        entrenched systems controlled by banks and governments are not going to
        risk the arduous path towards migrating to blockchain and all its
        trade-offs simply for philosophical reasons.
      </Paragraph>
      <Paragraph>
        The formula of “old idea now powered by blockchain” is doing wonders for
        cryptocurrency’s price in the short term but has not yet generated the
        value it needs to in order to be sustainable in the long term.
      </Paragraph>
    </Post>
  );
}
