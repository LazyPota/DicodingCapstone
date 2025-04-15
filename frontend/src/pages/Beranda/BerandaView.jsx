import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import bgImage from "../../assets/background.jpg";
import bgImage2 from "../../assets/background2.png";
import bgImage3 from "../../assets/background3.png";
import bgImage4 from "../../assets/CTA.png";
import icon from "../../assets/icon.png";
import FeatureCard from "../../components/FeatureCard";
import iphoneSavings from "../../assets/phone-mockup-tujuan.png";
import iphoneExpenses from "../../assets/phone-mockup-transaksi.png";
import dompetCard from "../../assets/dompet-card.png";
import financeHealthCard from "../../assets/finance-health-card.png";
import Testimonials from "../../components/Testimonials";
import Footer from "../../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const BerandaView = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <main>
      <Navbar />
      <section className="p-2">
        <aside
          aria-labelledby="hero-heading"
          className="p-2 relative flex space-x-20 items-center justify-between w-full h-[822px] px-10 text-white rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            borderRadius: "16px",
          }}
          data-aos="fade-in"
        >
          <div
            className="max-w-lg space-y-[28px] z-1 p-5"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl font-bold leading-tight text-white"
            >
              Solusi Cerdas Untuk <br />
              Keuangan Sehat💰
            </h1>
            <p className="text-lg font-semibold text-gray-200">
            Perencana keuangan pintar untuk membantu Anda mengelola 
            pendapatan, pengeluaran, dan tabungan dengan mudah. 
            Kelola keuangan lebih baik, capai tujuan lebih cepat!
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button text="Mulai Sekarang" variant="primary" />
              <Button text="Baca Lengkap" variant="secondary" />
            </div>
          </div>
          <div
            className="hidden md:block absolute right-0 lg:right-[5%] xl:right-[2%] top-1/2 transform -translate-y-1/2 w-[55%] lg:w-[50%] xl:w-[45%] h-auto z-10"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="relative w-[450px] aspect-[4/3.5] bottom-72">
              <img
                src={dompetCard}
                alt="Tampilan kartu dompet di aplikasi Moneasy"
                className="absolute bottom-[5%] left-[50%] w-[70%] lg:w-[65%] h-auto rounded-xl lg:rounded-2xl shadow-xl z-0"
                loading="lazy"
              />
              <img
                src={financeHealthCard}
                alt="Tampilan kartu kesehatan finansial di aplikasi Moneasy"
                className="absolute top-[50%] left-[5%] w-[75%] lg:w-[70%] h-auto rounded-xl lg:rounded-2xl shadow-2xl z-10"
                loading="lazy"
              />
            </div>
          </div>
        </aside>
      </section>

      <section
        aria-labelledby="features-heading"
        className="mt-[60px] md:mt-[118px] py-10 md:py-12"
      >
        <div className="container mx-auto px-10 ">
          <h2
            id="features-heading"
            className="text-black text-center font-extrabold text-3xl md:text-[40px] leading-tight"
            data-aos="fade-up"
          >
            Fitur Canggih untuk Masa Depan Finansial Anda!
          </h2>
          <p
            className="text-black font-medium text-center mt-[15px] text-base md:text-[18px] max-w-xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Wujudkan masa depan finansial yang lebih cerah dengan fitur inovatif kami!{" "}
          </p>
          <div className="mt-[60px] grid grid-cols-1 md:grid-cols-3">
            <article
              className="relative bg-blue-600 text-white rounded-[40px] flex flex-col h-[610px] w-[399px]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-[18px] md:text-[20px] font-extrabold uppercase tracking-wide">
                perencanaan tujuan
                </h3>
                <p className="text-[15px] md:text-[16px] mt-3 md:mt-4 font-medium">
                Capai tujuan finansial Anda lebih cepat dengan tabungan berbasis tujuan!
                </p>
              </div>
              <div className="mt-auto flex justify-center">
                <img
                  src={iphoneSavings}
                  alt="Moneasy app showing goal-based saving plan interface on an iPhone"
                  className="max-w-[85%] h-auto"
                />
              </div>
            </article>
            <div
              className="text-black rounded-2xl flex flex-col gap-y-8 md:gap-y-5 items-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <FeatureCard
                title="SKOR KESEHATAN FINANSIAL"
                description="Pantau kondisi keuangan Anda dengan skor kesehatan finansial yang mudah dipahami."
                icon="solar:wallet-bold-duotone"
              />
              <FeatureCard
                title="ASISTEN PENGANGGARAN "
                description="Atur anggaran secara otomatis berdasarkan pemasukan Anda dan hindari pengeluaran berlebih."
                icon="bx:transfer"
              />
            </div>
            <article
              className="relative bg-blue-600 text-white rounded-[40px] flex flex-col h-[610px] w-[399px]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-[18px] md:text-[20px] font-extrabold uppercase tracking-wide">
                Pelacak Pengeluaran
                </h3>
                <p className="text-[15px] md:text-[16px] mt-3 md:mt-4 font-medium">
                Cek pengeluaran dengan cepat menggunakan pemindaian struk atau input manual.
                </p>
              </div>
              <div className="mt-auto flex justify-center">
                <img
                  src={iphoneExpenses}
                  alt="Moneasy app showing goal-based saving plan interface on an iPhone"
                  className="max-w-[85%] h-auto"
                />
              </div>
            </article>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="about-heading"
        className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div
          className="flex gap-4 lg:gap-6 relative w-full lg:w-1/2 justify-center order-last lg:order-first"
          data-aos="fade-right"
        >
          <img
            src={bgImage2}
            alt="Mengelola keuangan dengan kalkulator dan uang tunai"
            className="rounded-[24px] md:rounded-[40px] w-[45%] max-w-[280px] h-auto object-cover shadow-lg"
          />
          <img
            src={bgImage3}
            alt="Analisis finansial di aplikasi Moneasy"
            className="rounded-[24px] md:rounded-[40px] relative top-10 md:top-16 lg:top-24 w-[45%] max-w-[280px] h-auto object-cover shadow-lg"
          />
        </div>
        <div
          className="w-full lg:w-1/2 text-center lg:text-left"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-black leading-tight mb-4"
          >
            Keuangan Cerdas untuk Masa Depan yang Aman
          </h2>
          <p className="text-gray-700 text-base md:text-lg font-regular mb-8 md:mb-10">
            Kelola keuangan Anda lebih mudah dan efektif bersama Moneasy. Kami
            percaya setiap orang berhak memiliki kendali penuh atas keuangan
            mereka. Misi kami menciptakan solusi pengelolaan keuangan yang
            cerdas, aman, dan mudah diakses, sehingga siapa pun dapat mencapai
            tujuan keuangan mereka tanpa stres.
          </p>
          <Button text="Mulai Sekarang" variant="primary" size="lg" />
        </div>
      </section>
      <section
        aria-labelledby="testimonials-heading"
        className="flex flex-col items-center py-10 px-4 mt-[60px] md:mt-[118px] overflow-hidden"
      >
        <h2
          id="testimonials-heading"
          className="text-3xl md:text-[40px] font-extrabold text-black mb-6 text-center" /* Text center */
          data-aos="fade-up"
        >
          Ulasan pelanggan tentang Moneasy
        </h2>
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="w-full max-w-4xl"
        >
          {" "}
          {/* Batasi lebar testimoni */}
          <Testimonials />
        </div>
      </section>

      {/* Section 5: Call to Action (CTA) */}
      <section
        aria-labelledby="cta-heading"
        className="relative w-full min-h-[50vh] md:h-[555px] px-4 md:px-10 text-white object-cover flex items-center justify-center mt-[60px] md:mt-[118px]"
        style={{
          backgroundImage: `url(${bgImage4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="zoom-in"
      >
        {/* Overlay gelap opsional untuk kontras teks */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Konten CTA di atas overlay */}
        <div className="relative z-10 max-w-lg text-center space-y-[32px] p-4">
          <div
            className="flex justify-center"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {/* Perbaiki kelas shadow dan background blur jika diperlukan */}
            <div
              className="w-[64px] h-[64px] bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50" /* Shadow lebih simpel */
            >
              <img src={icon} alt="Ikon aplikasi Moneasy" className="w-8 h-8" />{" "}
              {/* Ukuran ikon disesuaikan */}
            </div>
          </div>
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold leading-tight text-white"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {" "}
            {/* Ganti ke H2 */}
            Mulailah Dengan <br />
            Moneasy Hari Ini
          </h2>
          <p
            className="text-lg font-semibold text-gray-200"
            data-aos="fade-up"
            data-aos-delay="400"
          >
          Bergabunglah dengan ribuan pengguna lain dan mulailah mengelola keuangan dengan lebih cerdas!
          </p>
          <div
            className="flex justify-center space-x-4"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Button text="Mulai Sekarang" variant="secondary" size="lg" />
          </div>
        </div>
      </section>

      {/* Footer (asumsikan komponen Footer menggunakan tag <footer> secara internal) */}
      <Footer />
    </main>
  );
};

export default BerandaView;
