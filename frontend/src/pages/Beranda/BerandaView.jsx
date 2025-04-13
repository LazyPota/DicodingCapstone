import React, { useEffect } from "react";
import Navbar from "../../components/Navbar"; // Asumsi sudah responsif
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
import Testimonials from "../../components/Testimonials"; // Asumsi sudah responsif
import Footer from "../../components/Footer"; // Asumsi sudah responsif
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const BerandaView = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
    });
  }, []);

  const handleScroll = (sectionId) => {
    if (sectionId === "beranda-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else {
        console.warn(`Element with ID "${sectionId}" not found.`);
      }
    }
  };

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <section className="p-2 md:p-6 lg:p-4" id="beranda">
        <div
          aria-labelledby="hero-heading"
          className="relative flex flex-col lg:flex-row items-center justify-between w-full text-white rounded-2xl bg-cover bg-center overflow-hidden py-20 md:py-28 lg:py-32 px-6 sm:px-10 lg:px-16"
          style={{ backgroundImage: `url(${bgImage})` }}
          data-aos="fade-in"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-transparent lg:bg-black/10 z-0"></div>
          <div
            className="relative z-10 w-full lg:w-1/2 max-w-xl lg:max-w-lg space-y-6 md:space-y-[28px] text-center lg:text-left mb-10 lg:mb-0"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white"
            >
              Solusi Cerdas Untuk <br />
              Keuangan Sehat💰
            </h1>
            <p className="text-base sm:text-lg font-semibold text-gray-200">
              Perencana keuangan pintar untuk membantu Anda mengelola
              pendapatan, pengeluaran, dan tabungan dengan mudah. Kelola
              keuangan lebih baik, capai tujuan lebih cepat!
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                text="Mulai Sekarang"
                variant="primary"
                size="lg"
                as={Link}
                to="/login"
              />
              <Button text="Baca Lengkap" variant="secondary" size="lg" onClick={() => handleScroll("features")}/>
            </div>
          </div>

          <div
            className="hidden lg:block relative z-10 w-1/2 justify-center items-center"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="relative w-[410px] aspect-[4/3.5] bottom-[90px]">
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
        </div>
      </section>
      <section
        aria-labelledby="features-heading"
        className="mt-16 md:mt-[118px] py-16 md:py-20"
        id="features"
      >
        <div className="container mx-auto px-6 md:px-10">
          <h2
            id="features-heading"
            className="text-black text-center font-extrabold text-2xl sm:text-3xl md:text-[40px] leading-tight"
            data-aos="fade-up"
          >
            Fitur Canggih untuk Masa Depan Finansial Anda!
          </h2>
          <p
            className="text-black font-medium text-center mt-4 md:mt-[15px] text-base md:text-[18px] max-w-lg lg:max-w-xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Wujudkan masa depan finansial yang lebih cerah dengan fitur inovatif
            kami!
          </p>
          <div className="mt-12 md:mt-[60px] grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            <article
              className="relative bg-blue-600 text-white rounded-[40px] flex flex-col w-full max-w-sm md:max-w-md lg:max-w-none overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="p-6 md:p-8 flex-grow">
                <h3 className="text-lg md:text-[20px] font-extrabold uppercase tracking-wide">
                  Perencanaan Tujuan
                </h3>
                <p className="text-sm md:text-[16px] mt-3 md:mt-4 font-medium">
                  Capai tujuan finansial Anda lebih cepat dengan tabungan
                  berbasis tujuan!
                </p>
              </div>
              <div className="flex justify-center px-4">
                <img
                  src={iphoneSavings}
                  alt="Moneasy app showing goal-based saving plan interface on an iPhone"
                  className="max-w-[90%] md:max-w-[95%] lg:max-w-[90%] h-auto block"
                />
              </div>
            </article>
            <div
              className="w-full max-w-sm md:max-w-md lg:max-w-none text-black rounded-2xl flex flex-col gap-y-6 md:gap-y-5 items-center"
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
              className="relative bg-blue-600 text-white rounded-[40px] flex flex-col w-full max-w-sm md:max-w-md lg:max-w-none overflow-hidden lg:col-start-3" // Ensure it starts on 3rd col on large screens
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="p-6 md:p-8 flex-grow">
                <h3 className="text-lg md:text-[20px] font-extrabold uppercase tracking-wide">
                  Pelacak Pengeluaran
                </h3>
                <p className="text-sm md:text-[16px] mt-3 md:mt-4 font-medium">
                  Cek pengeluaran dengan cepat menggunakan pemindaian struk atau
                  input manual.
                </p>
              </div>
              <div className="flex justify-center px-4">
                <img
                  src={iphoneExpenses}
                  alt="Moneasy app showing expense tracking interface on an iPhone"
                  className="max-w-[90%] md:max-w-[95%] lg:max-w-[90%] h-auto block"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-heading"
        className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center py-16 md:py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto "
        id="tentang-kami"
      >
        <div
          className="flex flex-row gap-4 lg:gap-6 w-full lg:w-1/2 justify-center order-2 lg:order-1"
          data-aos="fade-right"
        >
          <img
            src={bgImage2}
            alt="Mengelola keuangan dengan kalkulator dan uang tunai"
            className="rounded-[24px] md:rounded-[40px] w-1/2 h-[500px] md:h-[700px] object-cover shadow-lg aspect-[3/4]"
          />
          <img
            src={bgImage3}
            alt="Analisis finansial di aplikasi Moneasy"
            className="rounded-[24px] md:rounded-[40px] w-1/2 h-auto object-cover shadow-lg aspect-[3/4] relative top-8 md:top-12 lg:top-16"
          />
        </div>
        <div
          className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2" // Order berubah di lg
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <h2
            id="about-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-black leading-tight mb-4"
          >
            Keuangan Cerdas untuk Masa Depan yang Aman
          </h2>
          <p className="text-gray-700 text-base md:text-lg mb-8 md:mb-10">
            Kelola keuangan Anda lebih mudah dan efektif bersama Moneasy. Kami
            percaya setiap orang berhak memiliki kendali penuh atas keuangan
            mereka. Misi kami menciptakan solusi pengelolaan keuangan yang
            cerdas, aman, dan mudah diakses, sehingga siapa pun dapat mencapai
            tujuan keuangan mereka tanpa stres.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Button
              text="Mulai Sekarang"
              variant="primary"
              size="lg"
              as={Link}
              to="/login"
            />
          </div>
        </div>
      </section>
      <section
        aria-labelledby="testimonials-heading"
        className="hidden flex-col items-center py-16 md:py-20 px-4 mt-16 md:mt-[118px] lg:flex overflow-hidden"
        id="testimoni"
      >
        <h2
          id="testimonials-heading"
          className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-black mb-6 md:mb-10 text-center"
          data-aos="fade-up"
        >
          Ulasan pelanggan tentang Moneasy
        </h2>
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="w-full max-w-4xl px-4 sm:px-0"
        >
          <Testimonials />
        </div>
      </section>
      <section
        aria-labelledby="cta-heading"
        className="relative w-full min-h-[60vh] md:min-h-[555px] px-4 py-16 md:py-20 text-white flex items-center justify-center mt-16 md:mt-[118px]" // Ganti h tetap ke min-h, adjust padding
        id="hubungi-kami"
        style={{
          backgroundImage: `url(${bgImage4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="zoom-in"
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-lg text-center space-y-6 md:space-y-[32px] p-4">
          <div
            className="flex justify-center"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            <div className="w-14 h-14 md:w-[64px] md:h-[64px] bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src={icon}
                alt="Ikon aplikasi Moneasy"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>
          </div>
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Mulailah Dengan <br />
            Moneasy Hari Ini
          </h2>
          <p
            className="text-base sm:text-lg font-semibold text-gray-200"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Bergabunglah dengan ribuan pengguna lain dan mulailah mengelola
            keuangan dengan lebih cerdas!
          </p>
          <div
            className="flex justify-center space-x-4"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Button text="Hubungi Sekarang" variant="secondary" size="lg" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default BerandaView;
