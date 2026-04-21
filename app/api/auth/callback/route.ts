import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  try {
    const signinUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/signin`;
    const signinBody = {
      authCode: code,
      redirectUri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL!,
    };

    console.log("auth/signin request:", {
      url: signinUrl,
      body: signinBody,
    });

    const response = await instance.post(signinUrl, signinBody);

    console.log("auth/signin response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("auth/signin error:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });

      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    throw error;
  }
}
