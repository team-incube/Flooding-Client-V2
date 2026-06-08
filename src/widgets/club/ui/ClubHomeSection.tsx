"use client";

import { useState } from "react";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { clubManagementQueries } from "@/entities/club-management/api/clubManagementQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ClubSection } from "@/features/club/ui/ClubSection";
import ClubSearch from "@/features/club/ui/ClubSearch";
import ClubRegistrationSection from "@/features/club/ui/ClubRegistrationSection";
import { ClubOpeningRequestSection } from "@/features/club-management/ui/ClubOpeningRequestSection";
import ClubExportButton from "@/features/club-management/ui/ClubExportButton";
import {
  filterClubs,
  type ClubTypeFilter,
} from "@/features/club/lib/filterClubs";
import { useClubViewMode } from "@/features/club/model/useClubViewMode";
import { createClubPermission } from "@/entities/club/lib/permission";

function ClubCardSkeleton() {
  return (
    <div className="bg-sub-4 flex min-h-[250px] flex-col gap-4 rounded-2xl px-4 py-6">
      <Skeleton className="h-33.5 w-full shrink-0 rounded-2xl" />
      <div className="flex flex-col items-start gap-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

function ClubSearchSkeleton() {
  return (
    <div className="flex w-full min-w-82.5 flex-col items-start gap-4">
      <div className="w-full">
        <Skeleton className="h-[47px] w-full rounded-lg" />
      </div>
      <div className="w-full">
        <Skeleton className="h-[47px] w-full rounded-lg" />
      </div>
    </div>
  );
}

function ClubHomeSectionLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 px-5 pb-25 sm:px-8 lg:px-8 xl:px-10 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
            <div>
              <span className="text-caption-1 text-sub-1">동아리 수 </span>
              <span className="text-caption-1 text-p-1">0개</span>
            </div>
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="order-2 min-h-0 flex-1 lg:order-1 lg:h-full lg:pr-2">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ClubCardSkeleton key={index} />
              ))}
            </div>
          </div>

          <div className="order-1 self-stretch lg:order-2 lg:shrink-0 lg:self-start">
            <ClubSearchSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClubHomeSectionError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 px-5 pb-25 sm:px-8 lg:px-8 xl:px-10 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-5 sm:p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">
          동아리 목록을 불러오지 못했어요.
        </p>
        <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

function ClubHomeSection() {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<ClubTypeFilter>("ALL");

  const { data } = useSuspenseQuery(clubQueries.list());
  const { data: user } = useSuspenseQuery(userQueries.me());

  const clubPermission = createClubPermission({
    role: user.role,
  });

  const { viewMode, setViewMode } = useClubViewMode({
    canViewForm: clubPermission.canViewOpeningRequests,
  });

  const { data: openingStatus } = useQuery({
    ...clubManagementQueries.openingStatus(),
    enabled: clubPermission.canCheckOpeningStatus,
    retry: false,
  });

  const canRegisterClub =
    openingStatus?.isOpened === true && clubPermission.canRegisterClub;

  const { data: openingRequests } = useQuery({
    ...clubManagementQueries.openingRequests(),
    enabled: clubPermission.canViewOpeningRequests && viewMode === "form",
  });

  const filteredClubs = filterClubs({
    clubs: data.clubs,
    searchValue,
    type: selectedType,
  });

  const handleGoBackToList = () => {
    setViewMode("list");
    queryClient.invalidateQueries({ queryKey: clubQueries.list().queryKey });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value) setSearchValue("");
  };

  const handleSearch = () => setSearchValue(query);

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto px-5 pb-25 sm:px-8 lg:px-8 xl:px-10 2xl:px-18">
      <div className="bg-background-surface flex min-h-full w-full flex-col gap-4 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">
              {viewMode === "form" ? "개설 신청" : "동아리"}
            </span>
            <div>
              <span className="text-caption-1 text-sub-1">동아리 수 </span>
              <span className="text-caption-1 text-p-1">
                {viewMode === "form"
                  ? (openingRequests?.clubs.length ?? 0)
                  : filteredClubs.length}
                개
              </span>
            </div>
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="scrollbar-hide order-2 min-h-0 flex-1 overflow-y-auto lg:order-1 lg:h-full lg:pr-2">
            {viewMode === "list" ? (
              <ClubSection clubs={filteredClubs} />
            ) : (
              clubPermission.canViewOpeningRequests && (
                <ClubOpeningRequestSection />
              )
            )}
          </div>
          <div className="order-1 flex flex-col lg:order-2 lg:w-[330px] lg:shrink-0 lg:self-stretch">
            <div className="scrollbar-hide flex w-full flex-col gap-4 overflow-y-auto">
              <div className="flex w-full gap-1">
                <TextButton
                  variant={viewMode === "list" ? "filled" : "outlined"}
                  size="fit"
                  className="flex-1"
                  onClick={() => setViewMode("list")}
                >
                  동아리 검색
                </TextButton>
                <TextButton
                  variant={
                    viewMode === "form" && canRegisterClub
                      ? "filled"
                      : canRegisterClub
                        ? "outlined"
                        : "disabled"
                  }
                  size="fit"
                  className="flex-1"
                  disabled={!canRegisterClub}
                  onClick={() => {
                    if (canRegisterClub) setViewMode("form");
                  }}
                >
                  개설 신청
                </TextButton>
              </div>

              {viewMode === "form" && canRegisterClub ? (
                <ClubRegistrationSection onGoBackToList={handleGoBackToList} />
              ) : (
                <ClubSearch
                  query={query}
                  setQuery={handleQueryChange}
                  onSearch={handleSearch}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />
              )}
            </div>
            {clubPermission.canExport && viewMode === "list" && (
              <div className="flex flex-1 items-center justify-center py-12">
                <ClubExportButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClubHomeSectionBoundary() {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubHomeSectionLoading />}
      errorFallback={ClubHomeSectionError}
    >
      <ClubHomeSection />
    </ClientQueryBoundary>
  );
}

export { ClubHomeSection, ClubHomeSectionBoundary };
