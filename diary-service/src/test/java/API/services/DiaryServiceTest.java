/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package API.services;

import API.entities.Diary;
import API.entities.DiaryDTO;
import API.repositories.IDiaryRepository;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.Assert.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.is;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

/**
 *
 * @author Jonas
 */
public class DiaryServiceTest {

    public DiaryServiceTest() {
    }
    @InjectMocks
    private DiaryService diaryService;

    @Mock
    private IDiaryRepository repositoryMock;

    @Mock
    private ModelMapper modelMapper;

    private final UUID citizensId = UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3de");
    private final UUID authorIDDiary = UUID.fromString("6a7a8cb3-6502-4acc-b302-72b9e30bdf8e");
    private final UUID diaryId = UUID.fromString("e2a96b4d-edff-497b-a094-268e3b86ed28");
    private final Date date = new Date();
    List<UUID> listOfCitizenIds = Arrays.asList(UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3de"), UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3da"));

    private final List<Diary> diary = Arrays.asList(new Diary(UUID.fromString("06d0166d-46b6-4bb5-8572-9299fc87c3dc"), "abba", UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dd"), UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3de"), new Date(System.currentTimeMillis()), null, "titel44"));

    private final  List<Diary> diaries = Arrays.asList(new Diary(UUID.fromString("06d0166d-46b6-4bb5-8572-9299fc87c3dc"), "abba", UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dd"), UUID.fromString("34fbbdfe-672f-4936-aba7-22e83863f323"), new Date(System.currentTimeMillis()), null, "titel22"),
            new Diary(UUID.fromString("8dd18834-88de-4380-94e9-acf1c2506d3c"), "walla", UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dd"), UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3ff"), new Date(System.currentTimeMillis()), null, "titel33"));

    private final List<DiaryDTO> diaryDTO = java.util.Arrays.asList(
            new DiaryDTO(UUID.fromString("06d0166d-46b6-4bb5-8572-9299fc87c3dc"), "abba", UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dd"), UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3de"), "titel", new Date(System.currentTimeMillis()), null),
            new DiaryDTO(UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3df"), "lmao", UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dc"), UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3da"), "titel1", new Date(System.currentTimeMillis()), null)
    );

    DiaryDTO createDTO = new DiaryDTO(UUID.fromString("e7c41f9e-cace-4f4d-845f-f3c4ed3fdaf9"), "Halló", authorIDDiary, citizensId, "titill", new Date(), null);

    Diary createDiaryTest = new Diary(diaryId, "hallo", authorIDDiary, citizensId, this.date, null, "titil");

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    /**
     * Test of createDiary method, of class DiaryService.
     *
     * @throws java.lang.Exception
     */
    @Test
    public void testCreateDiary() throws Exception {
        when(repositoryMock.createDiary(createDiaryTest)).thenReturn(Optional.of(diary.get(0)));
        when(modelMapper.map(diary.get(0), Diary.class)).thenReturn(diary.get(0));
        when(modelMapper.map(createDiaryTest, Diary.class)).thenReturn(diary.get(0));

        DiaryDTO actual = diaryService.createDiary(Optional.of(createDTO));

        verify(repositoryMock, times(1)).createDiary(diary.get(0));
        verifyNoMoreInteractions(repositoryMock);

        assertThat(actual, is(diaryDTO.get(0)));
    }

    /**
     * Test of findById method, of class DiaryService.
     */
    @Test
    public void testFindById() {

        fail("The test case is a prototype.");
    }

    /**
     * Test of findByCitizenId method, of class DiaryService.
     */
    @Test
    public void testFindByCitizenId() {

        fail("The test case is a prototype.");
    }

    /**
     * Test of getDiaries method, of class DiaryService.
     */
    @Test
    public void testGetDiaries() {

        when(repositoryMock.getDiaries(listOfCitizenIds)).thenReturn(diaries);
        when(modelMapper.map(diary.get(0), DiaryDTO.class)).thenReturn(diaryDTO.get(0));

        List<DiaryDTO> actual = diaryService.getDiaries(listOfCitizenIds);

        verify(repositoryMock, times(1)).getDiaries(listOfCitizenIds);
        verifyNoMoreInteractions(repositoryMock);

        modelMapper.validate();

        assertThat(actual, is(Arrays.asList(diaryDTO.get(0))));
    }

    /**
     * Test of updateDiary method, of class DiaryService.
     */
    @Test
    public void testUpdateDiary() {
       // UUID authorId = UUID.fromString("75d988af-13d8-4513-ad27-3aa7741cc823");
        when(repositoryMock.updateDiary(createDiaryTest)).thenReturn(Optional.of(createDiaryTest));

        when(modelMapper.map(createDTO, Diary.class)).thenReturn(createDiaryTest);
     //   when(modelMapper.map(diaryDTO.get(1), Diary.class)).thenReturn(diaries.get(1));
        when(modelMapper.map(createDiaryTest, DiaryDTO.class)).thenReturn(createDTO);
      //  when(modelMapper.map(Optional.of(Arrays.asList(diaries.get(1))), DiaryDTO.class)).thenReturn(diaryDTO.get(1));
        
        DiaryDTO actual = diaryService.updateDiary(Optional.of(Arrays.asList(createDTO)));

        verify(repositoryMock, times(1)).updateDiary(createDiaryTest);
        verifyNoMoreInteractions(repositoryMock);

        assertThat(actual, is(createDTO));
    }

    /**
     * Test of deleteDiary method, of class DiaryService.
     */
    @Test
    public void testDeleteDiary() {
        UUID id = UUID.fromString("06d0166d-56b6-4bb5-8572-9299fc87c3dc");
        UUID authorId = UUID.fromString("75d988af-13d8-4513-ad27-3aa7741cc823");
        when(repositoryMock.deleteDiaryByCitizenId(id, authorId)).thenReturn(true);

        boolean actual = diaryService.deleteDiary(id, authorId);

        verify(repositoryMock, times(1)).deleteDiaryByCitizenId(id, authorId);
        verifyNoMoreInteractions(repositoryMock);

        assertTrue(actual);
    }

}