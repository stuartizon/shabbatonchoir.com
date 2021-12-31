import Layout from "../components/layout";
import Album from "../components/album";

const Music = () => {
    return (
        <Layout title="Music">
            <div className="flex flex-wrap justify-evenly md:justify-between gap-x-4">
                <Album
                    name="Mi Sheberach"
                    image="/MiSheberach.jpeg"
                    year="2021"
                    description="In tribute to our greatest inspiration, Rabbi Lord Jonathan Sacks זצ׳ל on the thirteenth anniversary of the release of &quot;Oseh Shalom&quot;."
                    amazonLink="https://music.amazon.co.uk/albums/B093K5VDGG"
                    appleLink="http://itunes.apple.com/album/id1564639715"
                    spotifyLink="https://open.spotify.com/album/2VOHpExGqA2uxhjEawqiK6?si=rkP9nCfmTpeN-wCelBT6iQ"
                />
                <Album
                    name="Anim Z'mirot"
                    image="/AnimZmirot.jpeg"
                    year="2016"
                    description="The Commemorative 25th Anniversary Album featuring 13 original compositions by the Choir's Former Musical Director Stephen Levey."
                    amazonLink="https://music.amazon.co.uk/albums/B01BFV2MVM"
                    appleLink="https://music.apple.com/us/album/%D7%90%D7%A0%D7%A2%D7%99%D7%9D-%D7%96%D7%9E%D7%99%D7%A8%D7%95%D7%AA-feat-shimon-craimer-lionel-rosenfeld-jonnny/1136788897"
                    spotifyLink="https://open.spotify.com/album/6zUeiV8EKcROBx6rVKi8oN?si=JywpwCKWSYuM1h9ueieWnQ"
                />
                <Album name="Shabbaton Sings Reuth"
                    image="/Reuth.jpeg"
                    year="2011"
                    amazonLink="https://music.amazon.co.uk/albums/B005KODZQ2"
                    appleLink="http://itunes.apple.com/album/id462269722"
                    spotifyLink="https://open.spotify.com/album/5KTiZWgYcdzcpZOHp8b525?si=pHf1R0UGSbeUKyQu91z_OQ"
                />
                <Album name="Bilvavi"
                    image="/Bilvavi.jpeg"
                    year="2006"
                    description="The raison d’être of the choir is to &quot;sing a new song&quot; and the new CD follows in this tradition. It is a synthesis of old and contemporary Jewish liturgical and folk music. The CD features the well known synagogue pieces, &quot;Tsadik Katamar&quot; and &quot;Uv’nucho Yomar&quot;. A new arrangement of the Pesach prayer &quot;Tal&quot; and also the title track &quot;Bilvavi&quot; are both contemporary pieces written by the choir’s musical director Stephen Levey. Amongst the other pieces are the beautiful Talmon &quot;Ein Keloheinu&quot;, the evocative &quot;Lo Teida Milchama&quot; and an up beat arrangement of &quot;Shehecheyanu&quot;."
                    amazonLink="https://music.amazon.co.uk/albums/B005CTO9O2"
                    appleLink="http://itunes.apple.com/album/id449897402"
                    spotifyLink="https://open.spotify.com/album/3z35bAlp3BgUK0uoPUdy2L?si=QExfj38kT1e6dTYTgsHvGw"
                />
                <Album name="Shir Chadash"
                    image="/ShirChadash.gif"
                    year="2003"
                    description="The Shabbaton Choir plays to packed houses in concert; performing before thousands of people each year. Now you can bring the sound of the Shabbaton Choir into your living rooms. Recorded at studios in London this CD contains some of the Choir's best known concert repertoire and features soloists Lionel Rosenfeld and Shimon Craimer. The CD encapsulates the distinctive style of Jewish music as performed by the Shabbaton Choir. Many of the pieces are arranged by Stephen Glass and sung in the inimitable &quot;Shabbaton style&quot;. From the modern to the old; the soft to the loud, the devotional to the celebratory this CD has something for everyone."
                    amazonLink="https://music.amazon.co.uk/albums/B005CZSMKI"
                    appleLink="http://itunes.apple.com/album/id450814760"
                    spotifyLink="https://open.spotify.com/album/686i905TZ7PFjD1lZJrZps?si=rslIxfJYQqGAprq00neIDg"
                />
                <Album name="Selichot Live"
                    image="/SelichotLive.jpeg"
                    year="2001"
                    description="Recorded in front of a packed Holy Law South Broughton Congregation in Manchester, this CD combines the talents of the Shabbaton Choir with soloists Lionel Rosenfeld and Shimon Craimer. The CD captures the atmosphere of the United Synagogue's Choral Midnight Selichot Service for which the Shabbaton Choir has become internationally renowned."
                    amazonLink="https://music.amazon.co.uk/albums/B08BY7X3V8"
                    appleLink="http://itunes.apple.com/album/id1520981495"
                    spotifyLink="https://open.spotify.com/album/6MdT7tXKuekk5oYruzHCtt?si=G8qJCJ7uSjmuMBEXt-_9yw"
                />
            </div>
        </Layout>
    );
};

export default Music;
