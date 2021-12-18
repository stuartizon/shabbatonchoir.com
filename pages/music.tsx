import Layout from "../components/layout";
import Album from "../components/album";

const Music = () => {
    return (
        <Layout title="Music">
            <div className="flex flex-wrap justify-evenly">
                <Album
                    name="Mi Sheberach"
                    image="/MiSheberach.jpeg"
                    year="2021"
                    description="In tribute to our greatest inspiration, Rabbi Lord Jonathan Sacks זצ׳ל on the thirteenth anniversary of the release of &quot;Oseh Shalom&quot;."
                />
                <Album
                    name="Anim Z'mirot"
                    image="/AnimZmirot.jpeg"
                    year="2016"
                    description="The Commemorative 25th Anniversary Album featuring 13 original compositions by the Choir's Former Musical Director Stephen Levey."
                />
                <Album name="Bilvavi"
                    image="/Bilvavi.jpeg"
                    year="2006"
                    description="The raison d’être of the choir is to &quot;sing a new song&quot; and the new CD follows in this tradition. It is a synthesis of old and contemporary Jewish liturgical and folk music. The CD features the well known synagogue pieces, &quot;Tsadik Katamar&quot; and &quot;Uv’nucho Yomar&quot;. A new arrangement of the Pesach prayer &quot;Tal&quot; and also the title track &quot;Bilvavi&quot; are both contemporary pieces written by the choir’s musical director Stephen Levey. Amongst the other pieces are the beautiful Talmon &quot;Ein Keloheinu&quot;, the evocative &quot;Lo Teida Milchama&quot; and an up beat arrangement of &quot;Shehecheyanu&quot;."
                />
                <Album name="Shir Chadash"
                    image="/ShirChadash.gif"
                    year="2003"
                    description="The Shabbaton Choir plays to packed houses in concert; performing before thousands of people each year. Now you can bring the sound of the Shabbaton Choir into your living rooms. Recorded at studios in London this CD contains some of the Choir's best known concert repertoire and features soloists Lionel Rosenfeld and Shimon Craimer. The CD encapsulates the distinctive style of Jewish music as performed by the Shabbaton Choir. Many of the pieces are arranged by Stephen Glass and sung in the inimitable &quot;Shabbaton style&quot;. From the modern to the old; the soft to the loud, the devotional to the celebratory this CD has something for everyone."
                />
                <Album name="Shabbaton Sings Reuth"
                    image="/Reuth.jpeg"
                    year=""
                />
                <Album name="Selichot Live"
                    image="/SelichotLive.jpeg"
                    year="2001"
                    description="Recorded in front of a packed Holy Law South Broughton Congregation in Manchester, this CD combines the talents of the Shabbaton Choir with soloists Lionel Rosenfeld and Shimon Craimer. The CD captures the atmosphere of the United Synagogue's Choral Midnight Selichot Service for which the Shabbaton Choir has become internationally renowned."
                />
            </div>
        </Layout>
    );
};

export default Music;
