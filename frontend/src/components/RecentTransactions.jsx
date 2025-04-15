import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const RecentTransactions = () => {
  return (
    <div className="bg-white rounded-[16px] p-4">
      <h2 className="text-[20px] font-bold">Transaksi Terbaru</h2>
      <table className="w-full h-[360px] mt-4">
        <thead>
          <tr className="text-left text-[12px] text-[#2B2B2B]">
            <th>Nama Dompet</th>
            <th className="pb-2">Nama</th>
            <th className="pb-2">Tanggal</th>
            <th className="pb-2">Total</th>
          </tr>
        </thead>
        <tbody className="text-[14px]">
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
          <tr>
            <td>Shopee</td>
            <td className="flex space-x-2 items-center">
              <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                <Icon icon="solar:arrow-left-down-linear" />
              </span>
              <span>Gaji Perbulan</span>
            </td>
            <td>20 Apr 2020</td>
            <td className="text-green-500">Rp. 8jt</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
